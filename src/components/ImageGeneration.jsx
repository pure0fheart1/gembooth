import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase/client'
import { useNavigate } from 'react-router-dom'
import { GoogleGenAI } from '@google/genai'
import { checkUsageLimit, incrementUsage } from '../lib/usageTracking'
import '../styles/ImageGeneration.css'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export default function ImageGeneration() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [numImages, setNumImages] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedImages, setGeneratedImages] = useState([])
  const [error, setError] = useState(null)

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const generateImages = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    if (numImages < 1 || numImages > 10) {
      setError('Number of images must be between 1 and 10')
      return
    }

    if (!GEMINI_API_KEY) {
      setError('API key not configured. Please check your environment variables.')
      return
    }

    // Check usage limit - verify user has enough remaining uses for all images
    const usageCheck = await checkUsageLimit(user.id, 'generated_image')
    if (!usageCheck.allowed) {
      setError(usageCheck.message || 'You have reached your AI Image Generation limit for this month. Please upgrade your plan to continue.')
      return
    }

    // Check if user has enough remaining uses for the requested number of images
    const remainingUses = usageCheck.limit === -1 ? Infinity : usageCheck.limit - usageCheck.used
    if (remainingUses < numImages && usageCheck.limit !== -1) {
      setError(`You only have ${remainingUses} image generation${remainingUses === 1 ? '' : 's'} remaining this month. Please reduce the number of images or upgrade your plan.`)
      return
    }

    setGenerating(true)
    setError(null)
    setProgress(0)
    setGeneratedImages([])

    try {
      // Initialize Google GenAI
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

      setProgress(20)

      // Generate images using Imagen 4.0 API
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: numImages,
          outputMimeType: 'image/png',
        },
      })

      setProgress(70)

      if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error('No images were generated. The model may have refused the request.')
      }

      // Convert to base64 data URLs
      const images = response.generatedImages.map(img => {
        const base64ImageBytes = img.image.imageBytes
        return {
          base64: base64ImageBytes,
          dataUrl: `data:image/png;base64,${base64ImageBytes}`,
          prompt: prompt
        }
      })

      setProgress(80)

      // Save all generated images to Supabase
      await saveImagesToDatabase(images)

      // Increment usage for each generated image
      for (let i = 0; i < images.length; i++) {
        await incrementUsage(user.id, 'generated_image')
      }

      setProgress(100)
      setGeneratedImages(images)
    } catch (err) {
      console.error('Generation error:', err)

      // Provide helpful error messages
      if (err.message?.includes('quota')) {
        setError('API quota exceeded. Please try again later or check your billing settings.')
      } else if (err.message?.includes('safety') || err.message?.includes('refused')) {
        setError('The AI refused to generate this image. Please try a different prompt that follows content policies.')
      } else if (err.message?.includes('API key')) {
        setError('Invalid API key. Please check your configuration.')
      } else {
        setError(err.message || 'Failed to generate images. Please try again.')
      }
    } finally {
      setGenerating(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const saveImagesToDatabase = async (images) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const imageId = crypto.randomUUID()

      try {
        // Convert base64 to blob
        const response = await fetch(`data:image/png;base64,${image.base64}`)
        const blob = await response.blob()

        // Upload to Supabase Storage
        const filePath = `${user.id}/${imageId}.png`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-photos')
          .upload(filePath, blob, {
            contentType: 'image/png',
            upsert: false
          })

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('user-photos')
          .getPublicUrl(filePath)

        // Save to generated_images table
        const { error: dbError } = await supabase
          .from('generated_images')
          .insert({
            id: imageId,
            user_id: user.id,
            image_url: urlData.publicUrl,
            prompt: prompt,
            is_public: false
          })

        if (dbError) throw dbError

        // Update image with URL
        image.url = urlData.publicUrl
        image.id = imageId

        // Update progress
        setProgress(80 + (i + 1) / images.length * 20)
      } catch (err) {
        console.error(`Error saving image ${i + 1}:`, err)
        // Don't throw - continue saving other images
      }
    }
  }

  const handleDownload = (image, index) => {
    const link = document.createElement('a')
    link.href = image.dataUrl
    link.download = `generated-${index + 1}.png`
    link.click()
  }

  return (
    <div className="imageGenerationPage">
      <div className="pageHeader">
        <h1>🎨 AI Image Generation</h1>
        <p>Generate up to 10 unique images from your imagination using Google Imagen 4.0</p>
      </div>

      <div className="generationForm">
        <div className="formGroup">
          <label htmlFor="prompt">
            Describe what you want to create
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A majestic Charizard flying through a sunset sky with dramatic clouds..."
            rows={4}
            disabled={generating}
          />
        </div>

        <div className="formGroup">
          <label htmlFor="numImages">
            Number of images (1-10)
          </label>
          <div className="numberInputWrapper">
            <input
              type="number"
              id="numImages"
              min="1"
              max="10"
              value={numImages}
              onChange={(e) => setNumImages(parseInt(e.target.value) || 1)}
              disabled={generating}
            />
            <input
              type="range"
              min="1"
              max="10"
              value={numImages}
              onChange={(e) => setNumImages(parseInt(e.target.value))}
              disabled={generating}
              className="rangeSlider"
            />
          </div>
        </div>

        {error && (
          <div className="errorMessage">
            {error}
          </div>
        )}

        <button
          onClick={generateImages}
          disabled={generating || !prompt.trim()}
          className="generateButton"
        >
          {generating ? (
            <>
              <span className="spinner"></span>
              Generating {numImages} {numImages === 1 ? 'image' : 'images'}... {Math.round(progress)}%
            </>
          ) : (
            <>
              ✨ Generate {numImages} {numImages === 1 ? 'Image' : 'Images'}
            </>
          )}
        </button>

        {generating && (
          <div className="progressBar">
            <div className="progressFill" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>

      {generatedImages.length > 0 && (
        <div className="generatedResults">
          <h2>Generated Images</h2>
          <p className="successMessage">
            ✅ All images saved to your gallery!
          </p>
          <div className="imageGrid">
            {generatedImages.map((image, index) => (
              <div key={index} className="generatedImageCard">
                <img
                  src={image.dataUrl}
                  alt={`Generated ${index + 1}`}
                />
                <div className="imageActions">
                  <button
                    onClick={() => handleDownload(image, index)}
                    className="downloadBtn"
                    title="Download"
                  >
                    ⬇️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
