/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GIFEncoder, quantize, applyPalette} from 'https://unpkg.com/gifenc'
import useStore from './store'
import imageData from './imageData'
import modes from './modes'
import { supabase } from './supabase/client'
import { checkUsageLimit, incrementUsage } from './stripe/subscriptionService'

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

    // Call Edge Function for AI processing (it handles storage and DB)
    const { data, error } = await supabase.functions.invoke('process-image', {
      body: {
        inputImage: b64,
        mode: activeMode,
        prompt: activeMode === 'custom' ? customPrompt : modes[activeMode].prompt,
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

init()
