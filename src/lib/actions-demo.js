/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GIFEncoder, quantize, applyPalette} from 'https://unpkg.com/gifenc'
import useStore from './store'
import imageData from './imageData'
import gen from './llm'
import modes from './modes'

const get = useStore.getState
const set = useStore.setState
const gifSize = 512
const model = 'gemini-2.5-flash-image-preview'

// Demo mode limits
const MAX_DEMO_PHOTOS = 5
const DEMO_STORAGE_KEY = 'gembooth_demo_data'
const DEMO_EXPIRY_KEY = 'gembooth_demo_expiry'
const DEMO_EXPIRY_HOURS = 24

export const init = () => {
  if (get().didInit) {
    return
  }

  // Load demo data from localStorage
  loadDemoDataFromStorage()

  set(state => {
    state.didInit = true
    state.isDemoMode = true
  })
}

// Save demo data to localStorage
const saveDemoDataToStorage = () => {
  try {
    const {photos} = get()
    const demoData = {
      photos: photos.map(p => ({
        id: p.id,
        mode: p.mode,
        isBusy: false // Don't save busy state
      })),
      imageData: {
        inputs: {...imageData.inputs},
        outputs: {...imageData.outputs}
      }
    }

    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoData))
    localStorage.setItem(DEMO_EXPIRY_KEY, Date.now() + (DEMO_EXPIRY_HOURS * 60 * 60 * 1000))
  } catch (error) {
    console.warn('Failed to save demo data to localStorage:', error)
  }
}

// Load demo data from localStorage
const loadDemoDataFromStorage = () => {
  try {
    const expiryTime = localStorage.getItem(DEMO_EXPIRY_KEY)

    // Check if data has expired
    if (!expiryTime || Date.now() > parseInt(expiryTime)) {
      clearDemoData()
      return
    }

    const savedData = localStorage.getItem(DEMO_STORAGE_KEY)
    if (!savedData) return

    const demoData = JSON.parse(savedData)

    // Restore photos
    if (demoData.photos) {
      set(state => {
        state.photos = demoData.photos
        state.demoPhotosCreated = demoData.photos.length
      })
    }

    // Restore image data
    if (demoData.imageData) {
      Object.assign(imageData.inputs, demoData.imageData.inputs || {})
      Object.assign(imageData.outputs, demoData.imageData.outputs || {})
    }
  } catch (error) {
    console.warn('Failed to load demo data from localStorage:', error)
    clearDemoData()
  }
}

// Clear demo data
export const clearDemoData = () => {
  try {
    localStorage.removeItem(DEMO_STORAGE_KEY)
    localStorage.removeItem(DEMO_EXPIRY_KEY)

    set(state => {
      state.photos = []
      state.demoPhotosCreated = 0
    })

    // Clear image data
    Object.keys(imageData.inputs).forEach(key => delete imageData.inputs[key])
    Object.keys(imageData.outputs).forEach(key => delete imageData.outputs[key])
  } catch (error) {
    console.warn('Failed to clear demo data:', error)
  }
}

export const snapPhoto = async b64 => {
  const {demoPhotosCreated} = get()

  // Check demo limit
  if (demoPhotosCreated >= MAX_DEMO_PHOTOS) {
    // Don't throw error, just silently return - UI will handle showing signup prompt
    return { limitReached: true }
  }

  const id = crypto.randomUUID()
  const {activeMode, customPrompt} = get()
  imageData.inputs[id] = b64

  set(state => {
    state.photos.unshift({id, mode: activeMode, isBusy: true})
    state.demoPhotosCreated = state.demoPhotosCreated + 1
  })

  try {
    const result = await gen({
      model,
      prompt: activeMode === 'custom' ? customPrompt : modes[activeMode].prompt,
      inputFile: b64
    })

    imageData.outputs[id] = result

    set(state => {
      state.photos = state.photos.map(photo =>
        photo.id === id ? {...photo, isBusy: false} : photo
      )
    })

    // Save to localStorage
    saveDemoDataToStorage()

    return { success: true }
  } catch (error) {
    console.error('Error processing photo:', error)

    // Remove failed photo
    set(state => {
      state.photos = state.photos.filter(photo => photo.id !== id)
      state.demoPhotosCreated = Math.max(0, state.demoPhotosCreated - 1)
    })

    delete imageData.inputs[id]

    return { error: error.message }
  }
}

export const deletePhoto = id => {
  set(state => {
    state.photos = state.photos.filter(photo => photo.id !== id)
    state.demoPhotosCreated = Math.max(0, state.demoPhotosCreated - 1)
  })

  delete imageData.inputs[id]
  delete imageData.outputs[id]

  // Save to localStorage
  saveDemoDataToStorage()
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

// GIF creation is disabled in demo mode - return error
export const makeGif = async () => {
  return {
    error: 'GIF creation is only available for registered users. Sign up to unlock this feature!'
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

// Favorites are not persisted in demo mode - just use local state
export const toggleFavorite = (modeKey) => {
  set(state => {
    const favorites = state.favoriteModes
    if (favorites.includes(modeKey)) {
      state.favoriteModes = favorites.filter(k => k !== modeKey)
    } else {
      state.favoriteModes = [...favorites, modeKey]
    }
  })
}

// Load favorites is a no-op in demo mode
export const loadFavoriteModes = () => {
  // Demo mode doesn't persist favorites
}

// Get demo status
export const getDemoStatus = () => {
  const {demoPhotosCreated} = get()
  return {
    photosCreated: demoPhotosCreated,
    photosRemaining: Math.max(0, MAX_DEMO_PHOTOS - demoPhotosCreated),
    limitReached: demoPhotosCreated >= MAX_DEMO_PHOTOS,
    maxPhotos: MAX_DEMO_PHOTOS
  }
}

// Enable demo mode
export const enableDemoMode = () => {
  set(state => {
    state.isDemoMode = true
  })
}

// Disable demo mode (when user signs up)
export const disableDemoMode = () => {
  set(state => {
    state.isDemoMode = false
  })
  clearDemoData()
}

init()
