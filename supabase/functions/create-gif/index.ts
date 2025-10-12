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
    const { photoIds, gifBlob, userId } = await req.json()
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const gifBuffer = Uint8Array.from(atob(gifBlob.split(',')[1]), c => c.charCodeAt(0))
    const gifFileName = `${userId}/${Date.now()}.gif`
    
    const { error: uploadError } = await supabase.storage
      .from('user-gifs')
      .upload(gifFileName, gifBuffer, { contentType: 'image/gif' })
    
    if (uploadError) throw uploadError
    
    const { data: { publicUrl: gifUrl } } = supabase.storage
      .from('user-gifs')
      .getPublicUrl(gifFileName)
    
    const { data: gif } = await supabase.from('gifs').insert({
      user_id: userId,
      gif_url: gifUrl,
      photo_ids: photoIds
    }).select().single()
    
    await supabase.from('usage_stats').insert({
      user_id: userId,
      action_type: 'gif_create'
    })
    
    return new Response(JSON.stringify({ success: true, gif }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
