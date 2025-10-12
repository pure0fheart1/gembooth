import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { inputImage, mode, prompt, userId } = await req.json()
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [
              { text: prompt || mode },
              { inlineData: { mimeType: 'image/jpeg', data: inputImage.split(',')[1] } }
            ]
          }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
        })
      }
    )
    
    const data = await response.json()
    const imageData = data.candidates[0].content.parts.find(p => p.inlineData).inlineData.data
    
    const inputFile = `${userId}/${crypto.randomUUID()}-input.jpg`
    const outputFile = `${userId}/${crypto.randomUUID()}-output.png`
    
    const inputBuffer = Uint8Array.from(atob(inputImage.split(',')[1]), c => c.charCodeAt(0))
    const outputBuffer = Uint8Array.from(atob(imageData), c => c.charCodeAt(0))
    
    await supabase.storage.from('user-photos').upload(inputFile, inputBuffer, { contentType: 'image/jpeg' })
    await supabase.storage.from('user-photos').upload(outputFile, outputBuffer, { contentType: 'image/png' })
    
    const { data: { publicUrl: inputUrl } } = supabase.storage.from('user-photos').getPublicUrl(inputFile)
    const { data: { publicUrl: outputUrl } } = supabase.storage.from('user-photos').getPublicUrl(outputFile)
    
    const { data: photo } = await supabase.from('photos').insert({
      user_id: userId,
      input_image_url: inputUrl,
      output_image_url: outputUrl,
      mode,
      prompt: prompt || mode
    }).select().single()
    
    return new Response(JSON.stringify({ success: true, photo, outputImage: `data:image/png;base64,${imageData}` }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
