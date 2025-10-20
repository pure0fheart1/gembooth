/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GIFEncoder, quantize, applyPalette} from 'https://unpkg.com/gifenc'
import useStore from './store'
import imageData from './imageData'
import modes from './modes'
import { supabase } from './supabase/client'
import { checkUsageLimit, incrementUsage, getUserSubscription } from './stripe/subscriptionService'
import { loadFavorites, toggleFavorite as toggleFavoriteFn } from './favoriteModes'

const get = useStore.getState
const set = useStore.setState
const gifSize = 512

export const init = () => {
  if (get().didInit) {
    return
  }

  set(state => {
    state.didInit = true
  })
}

// Helper to get current user
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user
}

// Upload image to Supabase Storage
const uploadToStorage = async (base64Data, userId, photoId, type = 'input') => {
  // Determine if it's JPEG or PNG from the data URL
  const isPNG = base64Data.startsWith('data:image/png')
  const extension = isPNG ? 'png' : 'jpg'
  const contentType = isPNG ? 'image/png' : 'image/jpeg'

  console.log('Upload debug:', { type, isPNG, base64DataStart: base64Data.substring(0, 50) })

  const base64 = base64Data.split(',')[1]
  const dataUrl = `data:${contentType};base64,${base64}`

  console.log('Data URL:', dataUrl.substring(0, 100))

  const blob = await fetch(dataUrl).then(r => r.blob())

  const fileName = `${userId}/${photoId}-${type}.${extension}`
  const { data, error} = await supabase.storage
    .from('user-photos')
    .upload(fileName, blob, {
      contentType,
      upsert: true
    })

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('user-photos')
    .getPublicUrl(fileName)

  return publicUrl
}

export const snapPhoto = async b64 => {
  const id = crypto.randomUUID()
  const {activeMode, customPrompt} = get()
  imageData.inputs[id] = b64

  try {
    const user = await getCurrentUser()

    // Check usage limits
    const canCreate = await checkUsageLimit(user.id, 'photo')
    if (!canCreate) {
      alert('You have reached your monthly photo limit. Please upgrade your plan to continue.')
      delete imageData.inputs[id]
      return
    }

    set(state => {
      state.photos.unshift({id, mode: activeMode, isBusy: true})
    })

    // Determine prompt based on mode type
    let prompt
    if (activeMode === 'custom' || activeMode.startsWith('custom-')) {
      // Custom or custom mode - use customPrompt
      prompt = customPrompt
    } else {
      // Predefined mode
      prompt = modes[activeMode].prompt
    }

    // Call Edge Function for AI processing (it handles storage and DB)
    const { data, error } = await supabase.functions.invoke('process-image', {
      body: {
        inputImage: b64,
        mode: activeMode,
        prompt,
        userId: user.id
      }
    })

    if (error) throw error

    // Increment usage counter
    await incrementUsage(user.id, 'photo')

    // The Edge Function returns the processed image data
    imageData.outputs[id] = data.outputImage

    set(state => {
      state.photos = state.photos.map(photo =>
        photo.id === id ? {...photo, isBusy: false} : photo
      )
    })
  } catch (error) {
    console.error('Error processing photo:', error)

    // Remove failed photo
    set(state => {
      state.photos = state.photos.filter(photo => photo.id !== id)
    })

    delete imageData.inputs[id]

    alert('Error processing photo. Please try again.')
  }
}

export const deletePhoto = async id => {
  try {
    const user = await getCurrentUser()

    // Delete from database
    await supabase
      .from('photos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    // Delete from storage
    const inputFile = `${user.id}/${id}-input.jpg`
    const outputFile = `${user.id}/${id}-output.jpg`

    await supabase.storage.from('user-photos').remove([inputFile, outputFile])

    set(state => {
      state.photos = state.photos.filter(photo => photo.id !== id)
    })

    delete imageData.inputs[id]
    delete imageData.outputs[id]
  } catch (error) {
    console.error('Error deleting photo:', error)
  }
}

export const setMode = mode =>
  set(state => {
    state.activeMode = mode
  })

const processImageToCanvas = async (base64Data, size) => {
  const img = new Image()
  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = base64Data
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = size
  canvas.height = size

  const imgAspect = img.width / img.height
  const canvasAspect = 1

  let drawWidth
  let drawHeight
  let drawX
  let drawY

  if (imgAspect > canvasAspect) {
    drawHeight = size
    drawWidth = drawHeight * imgAspect
    drawX = (size - drawWidth) / 2
    drawY = 0
  } else {
    drawWidth = size
    drawHeight = drawWidth / imgAspect
    drawX = 0
    drawY = (size - drawHeight) / 2
  }

  ctx.clearRect(0, 0, size, size)
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

  return ctx.getImageData(0, 0, size, size)
}

const addFrameToGif = (gif, imageData, size, delay) => {
  const palette = quantize(imageData.data, 256)
  const indexed = applyPalette(imageData.data, palette)

  gif.writeFrame(indexed, size, size, {
    palette,
    delay
  })
}

export const makeGif = async () => {
  const {photos} = get()

  try {
    const user = await getCurrentUser()

    // Check usage limits
    const canCreate = await checkUsageLimit(user.id, 'gif')
    if (!canCreate) {
      alert('You have reached your monthly GIF limit. Please upgrade your plan to continue.')
      return
    }

    set(state => {
      state.gifInProgress = true
    })

    const gif = new GIFEncoder()
    const readyPhotos = photos.filter(photo => !photo.isBusy)
    const photoIds = readyPhotos.map(p => p.id)

    for (const photo of readyPhotos) {
      const inputImageData = await processImageToCanvas(
        imageData.inputs[photo.id],
        gifSize
      )
      addFrameToGif(gif, inputImageData, gifSize, 333)

      const outputImageData = await processImageToCanvas(
        imageData.outputs[photo.id],
        gifSize
      )
      addFrameToGif(gif, outputImageData, gifSize, 833)
    }

    gif.finish()

    const gifBlob = new Blob([gif.buffer], {type: 'image/gif'})
    const gifUrl = URL.createObjectURL(gifBlob)

    // Upload GIF to storage
    const gifId = crypto.randomUUID()
    const gifFileName = `${user.id}/${gifId}.gif`

    const { error: uploadError } = await supabase.storage
      .from('user-gifs')
      .upload(gifFileName, gifBlob, {
        contentType: 'image/gif'
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-gifs')
      .getPublicUrl(gifFileName)

    // Save to database
    const { error: dbError } = await supabase
      .from('gifs')
      .insert({
        id: gifId,
        user_id: user.id,
        gif_url: publicUrl,
        photo_ids: photoIds
      })

    if (dbError) throw dbError

    // Increment usage counter
    await incrementUsage(user.id, 'gif')

    set(state => {
      state.gifUrl = gifUrl
    })
  } catch (error) {
    console.error('Error creating GIF:', error)
    alert('Error creating GIF. Please try again.')
    return null
  } finally {
    set(state => {
      state.gifInProgress = false
    })
  }
}

export const hideGif = () =>
  set(state => {
    state.gifUrl = null
  })

export const setCustomPrompt = prompt =>
  set(state => {
    state.customPrompt = prompt
  })

// Load favorite modes
export const loadFavoriteModes = async () => {
  try {
    const favorites = await loadFavorites()
    set(state => {
      state.favoriteModes = favorites
    })
  } catch (error) {
    console.error('Error loading favorite modes:', error)
  }
}

// Toggle favorite mode
export const toggleFavorite = async modeKey => {
  try {
    const updatedFavorites = await toggleFavoriteFn(modeKey)
    set(state => {
      state.favoriteModes = updatedFavorites
    })
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

// Batch process multiple photos
export const processBatch = async (files, mode) => {
  try {
    const user = await getCurrentUser()

    // Check subscription tier - batch upload is Pro/Premium feature
    const subscription = await getUserSubscription(user.id)
    const tier = subscription?.tier?.id || 'free'

    if (tier === 'free') {
      alert('Batch upload is a Pro/Premium feature. Please upgrade your plan to Pro or Premium to unlock this feature.')
      return null
    }

    // Validate files
    if (!files || files.length === 0) {
      alert('Please select at least one image to process.')
      return null
    }

    // Check file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      alert(`Invalid file types detected. Only JPEG and PNG images are supported.\nInvalid files: ${invalidFiles.map(f => f.name).join(', ')}`)
      return null
    }

    // Check file sizes (max 10MB per file)
    const maxSize = 10 * 1024 * 1024 // 10MB
    const oversizedFiles = files.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      alert(`Some files are too large (max 10MB per file).\nOversized files: ${oversizedFiles.map(f => f.name).join(', ')}`)
      return null
    }

    // Check if user has enough quota for the batch
    const canCreate = await checkUsageLimit(user.id, 'photo')
    if (!canCreate) {
      alert('You have reached your monthly photo limit. Please upgrade your plan or wait for your quota to reset.')
      return null
    }

    set(state => {
      state.batchUploadProgress = {
        total: files.length,
        completed: 0,
        current: null
      }
    })

    const results = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      set(state => {
        state.batchUploadProgress.current = i + 1
      })

      try {
        // Convert file to base64
        const reader = new FileReader()
        const base64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        // Check usage limit before each photo
        const canCreateNext = await checkUsageLimit(user.id, 'photo')
        if (!canCreateNext) {
          const remaining = files.length - i
          alert(`Usage limit reached. Successfully processed ${i} photos.\n${remaining} photos could not be processed.\n\nPlease upgrade your plan or wait for your monthly quota to reset.`)
          break
        }

        const id = crypto.randomUUID()
        imageData.inputs[id] = base64

        set(state => {
          state.photos.unshift({id, mode, isBusy: true})
        })

        // Determine prompt based on mode type
        let batchPrompt
        if (mode === 'custom' || mode.startsWith('custom-')) {
          batchPrompt = get().customPrompt
        } else {
          batchPrompt = modes[mode].prompt
        }

        // Call Edge Function for AI processing
        const { data, error } = await supabase.functions.invoke('process-image', {
          body: {
            inputImage: base64,
            mode,
            prompt: batchPrompt,
            userId: user.id
          }
        })

        if (error) throw error

        // Increment usage counter
        await incrementUsage(user.id, 'photo')

        // Store processed image
        imageData.outputs[id] = data.outputImage

        set(state => {
          state.photos = state.photos.map(photo =>
            photo.id === id ? {...photo, isBusy: false} : photo
          )
          state.batchUploadProgress.completed = i + 1
        })

        results.push({ success: true, id, fileName: file.name })
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
        results.push({ success: false, fileName: file.name, error: error.message })

        // Remove failed photo from UI
        set(state => {
          state.photos = state.photos.filter(photo => {
            // Find the most recent photo that's busy
            const recentBusyPhoto = state.photos.find(p => p.isBusy)
            return recentBusyPhoto ? photo.id !== recentBusyPhoto.id : true
          })
        })
      }
    }

    // Clear progress indicator
    set(state => {
      state.batchUploadProgress = null
    })

    // Return results (BatchUpload component will handle displaying them)
    return results
  } catch (error) {
    console.error('Error in batch processing:', error)
    alert('Error starting batch upload. Please try again.')

    set(state => {
      state.batchUploadProgress = null
    })

    return null
  }
}

// ==================== CUSTOM MODES (PREMIUM FEATURE) ====================

// Load user's custom modes
export const loadCustomModes = async () => {
  try {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('custom_modes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    set(state => {
      state.customModes = data || []
    })

    return data || []
  } catch (error) {
    console.error('Error loading custom modes:', error)
    return []
  }
}

// Create a new custom mode (Premium feature)
export const createCustomMode = async (name, emoji, prompt) => {
  try {
    const user = await getCurrentUser()

    // Check subscription tier - custom modes are Premium only
    const subscription = await getUserSubscription(user.id)
    const tier = subscription?.tier?.id || 'free'

    if (tier !== 'premium') {
      alert('Custom modes are a Premium feature. Please upgrade to Premium to create your own AI transformation modes.')
      return null
    }

    // Validate inputs
    if (!name || !prompt) {
      alert('Please provide both a name and prompt for your custom mode.')
      return null
    }

    if (name.length > 50) {
      alert('Mode name must be 50 characters or less.')
      return null
    }

    if (prompt.length > 1000) {
      alert('Prompt must be 1000 characters or less.')
      return null
    }

    // Create the mode
    const { data, error } = await supabase
      .from('custom_modes')
      .insert({
        user_id: user.id,
        name,
        emoji: emoji || '✨',
        prompt
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        alert('You already have a custom mode with this name. Please choose a different name.')
      } else {
        throw error
      }
      return null
    }

    // Add to state
    set(state => {
      state.customModes.unshift(data)
    })

    return data
  } catch (error) {
    console.error('Error creating custom mode:', error)
    alert('Error creating custom mode. Please try again.')
    return null
  }
}

// Update a custom mode
export const updateCustomMode = async (id, updates) => {
  try {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('custom_modes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    // Update in state
    set(state => {
      state.customModes = state.customModes.map(mode =>
        mode.id === id ? data : mode
      )
    })

    return data
  } catch (error) {
    console.error('Error updating custom mode:', error)
    alert('Error updating custom mode. Please try again.')
    return null
  }
}

// Delete a custom mode
export const deleteCustomMode = async id => {
  try {
    const user = await getCurrentUser()

    const { error } = await supabase
      .from('custom_modes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    // Remove from state
    set(state => {
      state.customModes = state.customModes.filter(mode => mode.id !== id)
    })

    return true
  } catch (error) {
    console.error('Error deleting custom mode:', error)
    alert('Error deleting custom mode. Please try again.')
    return false
  }
}

// Toggle custom mode favorite
export const toggleCustomModeFavorite = async id => {
  try {
    const user = await getCurrentUser()
    const mode = get().customModes.find(m => m.id === id)

    if (!mode) return

    const { data, error } = await supabase
      .from('custom_modes')
      .update({ is_favorite: !mode.is_favorite })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    // Update in state
    set(state => {
      state.customModes = state.customModes.map(m =>
        m.id === id ? data : m
      )
    })

    return data
  } catch (error) {
    console.error('Error toggling custom mode favorite:', error)
    return null
  }
}

init()
