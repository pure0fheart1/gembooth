/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useRef, useState, useCallback, useEffect} from 'react'
import c from 'clsx'
import * as supabaseActions from '../lib/actions-supabase'
import * as demoActions from '../lib/actions-demo'
import useStore from '../lib/store'
import imageData from '../lib/imageData'
import modes from '../lib/modes'
import EmptyState from './EmptyState'
import BatchUpload from './BatchUpload'
import CameraSettings from './CameraSettings'

// Helper to determine empty state type
const getEmptyStateType = (videoActive, activeMode, photos) => {
  if (!videoActive) return null

  // If there are any photos being processed, show processing state
  const hasProcessingPhoto = photos.some(p => p.isBusy)
  if (hasProcessingPhoto) return 'processing'

  // If no mode selected (shouldn't happen but defensive)
  if (!activeMode) return 'no-mode'

  // Default initial state when no photos exist
  if (photos.length === 0) return 'initial'

  return null
}

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const modeKeys = Object.keys(modes)

export default function App({ isDemo = false, photoLimit = null }) {
  // Select actions based on mode
  const actions = isDemo ? demoActions : supabaseActions
  const photos = useStore.use.photos()
  const customPrompt = useStore.use.customPrompt()
  const activeMode = useStore.use.activeMode()
  const gifInProgress = useStore.use.gifInProgress()
  const gifUrl = useStore.use.gifUrl()
  const favoriteModes = useStore.use.favoriteModes()
  const customModes = useStore.use.customModes()
  const [videoActive, setVideoActive] = useState(false)
  const [didInitVideo, setDidInitVideo] = useState(false)
  const [focusedId, setFocusedId] = useState(null)
  const [didJustSnap, setDidJustSnap] = useState(false)
  const [hoveredMode, setHoveredMode] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({top: 0, left: 0})
  const [showCustomPrompt, setShowCustomPrompt] = useState(false)
  const [photoError, setPhotoError] = useState(null)
  const [showBatchUpload, setShowBatchUpload] = useState(false)
  const videoRef = useRef(null)

  // Camera settings state
  const [showCameraSettings, setShowCameraSettings] = useState(false)
  const [facingMode, setFacingMode] = useState('user')
  const [timerDuration, setTimerDuration] = useState(0)
  const [burstMode, setBurstMode] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [isTakingBurst, setIsTakingBurst] = useState(false)
  const [burstProgress, setBurstProgress] = useState(null) // { current: 1, total: 5 }
  const streamRef = useRef(null)

  // Destructure action methods
  const { deletePhoto, setMode, makeGif, hideGif, toggleFavorite, setCustomPrompt } = actions

  // Load favorite modes and custom modes on mount (only in authenticated mode)
  useEffect(() => {
    if (!isDemo && actions.loadFavoriteModes) {
      actions.loadFavoriteModes()
    }
    if (!isDemo && actions.loadCustomModes) {
      actions.loadCustomModes()
    }
  }, [isDemo, actions])

  const startVideo = async (newFacingMode = facingMode) => {
    try {
      setDidInitVideo(true)

      // Stop existing stream if switching cameras
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {ideal: 1920},
          height: {ideal: 1080},
          facingMode: {ideal: newFacingMode}
        },
        audio: false
      })

      streamRef.current = stream
      setVideoActive(true)
      videoRef.current.srcObject = stream

      const {width, height} = stream.getVideoTracks()[0].getSettings()
      const squareSize = Math.min(width, height)
      canvas.width = squareSize
      canvas.height = squareSize
    } catch (error) {
      console.error('Error accessing camera:', error)
      setPhotoError('Unable to access camera. Please check permissions.')
      setDidInitVideo(false)
    }
  }

  // Immediate photo capture (internal function)
  const capturePhoto = async () => {
    const video = videoRef.current
    const {videoWidth, videoHeight} = video
    const squareSize = canvas.width
    const sourceSize = Math.min(videoWidth, videoHeight)
    const sourceX = (videoWidth - sourceSize) / 2
    const sourceY = (videoHeight - sourceSize) / 2

    ctx.clearRect(0, 0, squareSize, squareSize)
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // Only flip horizontally if using front camera
    if (facingMode === 'user') {
      ctx.scale(-1, 1)
      ctx.drawImage(
        video,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        -squareSize,
        0,
        squareSize,
        squareSize
      )
    } else {
      ctx.drawImage(
        video,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        squareSize,
        squareSize
      )
    }

    // Clear any previous errors
    setPhotoError(null)

    const result = await actions.snapPhoto(canvas.toDataURL('image/jpeg'))

    // Handle errors from demo mode
    if (result && result.error) {
      setPhotoError(result.error)
      return false
    }

    setDidJustSnap(true)
    setTimeout(() => setDidJustSnap(false), 1000)
    return true
  }

  // Timer countdown
  const takePhotoWithTimer = async () => {
    return new Promise((resolve) => {
      let timeLeft = timerDuration
      setCountdown(timeLeft)

      const countdownInterval = setInterval(() => {
        timeLeft -= 1
        if (timeLeft > 0) {
          setCountdown(timeLeft)
        } else {
          clearInterval(countdownInterval)
          setCountdown(null)
          capturePhoto().then(resolve)
        }
      }, 1000)
    })
  }

  // Burst mode - take 5 photos with 2.5s intervals
  const takeBurstPhotos = async () => {
    setIsTakingBurst(true)
    const totalPhotos = 5
    const intervalMs = 2500

    for (let i = 1; i <= totalPhotos; i++) {
      setBurstProgress({ current: i, total: totalPhotos })

      const success = await capturePhoto()

      if (!success) {
        // Stop burst if photo fails
        break
      }

      // Wait before next photo (except after the last one)
      if (i < totalPhotos) {
        await new Promise(resolve => setTimeout(resolve, intervalMs))
      }
    }

    setBurstProgress(null)
    setIsTakingBurst(false)
  }

  // Main photo trigger - routes to appropriate method
  const takePhoto = async () => {
    // Prevent multiple burst sessions
    if (isTakingBurst) return

    // Burst mode
    if (burstMode) {
      await takeBurstPhotos()
      return
    }

    // Timer mode
    if (timerDuration > 0) {
      await takePhotoWithTimer()
      return
    }

    // Instant photo
    await capturePhoto()
  }

  const handleRetryPhoto = useCallback(() => {
    setPhotoError(null)
  }, [])

  const downloadImage = () => {
    const a = document.createElement('a')
    a.href = gifUrl || imageData.outputs[focusedId]
    a.download = `gembooth.${gifUrl ? 'gif' : 'jpg'}`
    a.click()
  }

  const handleModeHover = useCallback((modeInfo, event) => {
    if (!modeInfo) {
      setHoveredMode(null)
      return
    }

    setHoveredMode(modeInfo)

    const rect = event.currentTarget.getBoundingClientRect()
    const tooltipTop = rect.top
    const tooltipLeft = rect.left + rect.width / 2

    setTooltipPosition({
      top: tooltipTop,
      left: tooltipLeft
    })
  }, [])

  const handleToggleFavorite = useCallback((modeKey, event) => {
    event.stopPropagation()
    toggleFavorite(modeKey)
  }, [])

  const isFavorite = useCallback((modeKey) => {
    return favoriteModes.includes(modeKey)
  }, [favoriteModes])

  // Organize modes: favorites first, then the rest
  const organizedModes = useCallback(() => {
    const allModeEntries = Object.entries(modes)
    const favoriteModeEntries = allModeEntries.filter(([key]) => favoriteModes.includes(key))
    const nonFavoriteModeEntries = allModeEntries.filter(([key]) => !favoriteModes.includes(key))
    return [...favoriteModeEntries, ...nonFavoriteModeEntries]
  }, [favoriteModes])

  // Organize custom modes (favorites first, then rest)
  const organizedCustomModes = useCallback(() => {
    if (!customModes || !Array.isArray(customModes) || customModes.length === 0) return []
    const favoriteCustom = customModes.filter(mode => mode && mode.is_favorite)
    const nonFavoriteCustom = customModes.filter(mode => mode && !mode.is_favorite)
    return [...favoriteCustom, ...nonFavoriteCustom]
  }, [customModes])

  // Handle GIF creation with demo mode support
  const handleMakeGif = async () => {
    const result = await makeGif()
    if (result && result.error) {
      alert(result.error)
    }
  }

  // Camera settings handlers
  const handleFacingModeChange = async (newMode) => {
    setFacingMode(newMode)
    if (videoActive) {
      await startVideo(newMode)
    }
  }

  const handleTimerChange = (duration) => {
    setTimerDuration(duration)
  }

  const handleBurstModeChange = (enabled) => {
    setBurstMode(enabled)
  }

  return (
    <main>
      <div
        className="video"
        onClick={() => {
          hideGif()
          setFocusedId(null)
        }}
      >
        {showCustomPrompt && (
          <div className="customPrompt">
            <button
              className="circleBtn"
              onClick={() => {
                setShowCustomPrompt(false)

                if (customPrompt.trim().length === 0) {
                  setMode(modeKeys[0])
                }
              }}
            >
              <span className="icon">close</span>
            </button>
            <textarea
              type="text"
              placeholder="Enter a custom prompt"
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setShowCustomPrompt(false)
                }
              }}
            />
          </div>
        )}
        <video
          ref={videoRef}
          muted
          autoPlay
          playsInline
          disablePictureInPicture="true"
        />
        {didJustSnap && <div className="flash" />}

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="countdownOverlay">
            <div className="countdownNumber">{countdown}</div>
            <div className="countdownText">Get ready...</div>
          </div>
        )}

        {/* Burst mode progress */}
        {burstProgress && (
          <div className="burstOverlay">
            <div className="burstProgress">
              <span className="icon">burst_mode</span>
              <div className="burstText">
                Photo {burstProgress.current} of {burstProgress.total}
              </div>
            </div>
          </div>
        )}

        {!videoActive && (
          <button className="startButton" onClick={startVideo}>
            <h1>📸 GemBooth</h1>
            <p>{didInitVideo ? 'One sec…' : 'Tap anywhere to start webcam'}</p>
          </button>
        )}

        {videoActive && (
          <div className="videoControls">
            <button
              className="settingsBtn"
              onClick={() => setShowCameraSettings(true)}
              title="Camera Settings"
              aria-label="Open camera settings"
            >
              <span className="icon">settings</span>
            </button>

            <button
              onClick={takePhoto}
              className="shutter"
              disabled={isTakingBurst || countdown !== null}
              aria-label="Take photo"
            >
              <span className="icon">camera</span>
            </button>

            <ul className="modeSelector">
              <li
                key="custom"
                onMouseEnter={e =>
                  handleModeHover({key: 'custom', prompt: customPrompt}, e)
                }
                onMouseLeave={() => handleModeHover(null)}
              >
                <button
                  className={c({active: activeMode === 'custom'})}
                  onClick={() => {
                    setMode('custom')
                    setShowCustomPrompt(true)
                  }}
                >
                  <span>✏️</span> <p>Custom</p>
                </button>
              </li>

              {/* Custom Modes Section (Premium Feature) */}
              {!isDemo && organizedCustomModes().length > 0 && (
                <>
                  <li className="favoritesLabel" key="custom-modes-label">
                    <span className="labelText">✨ My Custom Modes</span>
                  </li>
                  {organizedCustomModes().map((mode) => (
                    <li
                      key={`custom-${mode.id}`}
                      onMouseEnter={e => handleModeHover({key: `custom-${mode.id}`, prompt: mode.prompt}, e)}
                      onMouseLeave={() => handleModeHover(null)}
                      className={c({isFavorite: mode.is_favorite})}
                    >
                      <button
                        onClick={() => {
                          setMode(`custom-${mode.id}`)
                          setCustomPrompt(mode.prompt)
                        }}
                        className={c({active: activeMode === `custom-${mode.id}`})}
                      >
                        <span>{mode.emoji}</span> <p>{mode.name}</p>
                      </button>
                      <button
                        className="favoriteBtn"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (actions.toggleCustomModeFavorite) {
                            actions.toggleCustomModeFavorite(mode.id)
                          }
                        }}
                        aria-label={mode.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <span className="icon">{mode.is_favorite ? 'star' : 'star_border'}</span>
                      </button>
                    </li>
                  ))}
                </>
              )}

              {favoriteModes.length > 0 && (
                <li className="favoritesLabel" key="favorites-label">
                  <span className="labelText">⭐ Favorites</span>
                </li>
              )}
              {organizedModes().map(([key, {name, emoji, prompt}]) => (
                <li
                  key={key}
                  onMouseEnter={e => handleModeHover({key, prompt}, e)}
                  onMouseLeave={() => handleModeHover(null)}
                  className={c({isFavorite: isFavorite(key)})}
                >
                  <button
                    onClick={() => setMode(key)}
                    className={c({active: key === activeMode})}
                  >
                    <span>{emoji}</span> <p>{name}</p>
                  </button>
                  <button
                    className="favoriteBtn"
                    onClick={(e) => handleToggleFavorite(key, e)}
                    aria-label={isFavorite(key) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <span className="icon">{isFavorite(key) ? 'star' : 'star_border'}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(focusedId || gifUrl) && (
          <div className="focusedPhoto" onClick={e => e.stopPropagation()}>
            <button
              className="circleBtn"
              onClick={() => {
                hideGif()
                setFocusedId(null)
              }}
            >
              <span className="icon">close</span>
            </button>
            <img
              src={gifUrl || imageData.outputs[focusedId]}
              alt="photo"
              draggable={false}
            />
            <button className="button downloadButton" onClick={downloadImage}>
              Download
            </button>
          </div>
        )}
      </div>

      <div className="results">
        {!isDemo && (
          <button
            className="button batchUploadBtn"
            onClick={() => setShowBatchUpload(true)}
            title="Upload and process multiple photos at once"
          >
            <span className="icon">collections</span>
            Batch Upload
          </button>
        )}
        <ul>
          {photos.length > 0
            ? photos.map(({id, mode, isBusy}) => (
                <li className={c({isBusy})} key={id}>
                  <button
                    className="circleBtn deleteBtn"
                    onClick={() => {
                      deletePhoto(id)
                      if (focusedId === id) {
                        setFocusedId(null)
                      }
                    }}
                    aria-label="Delete photo"
                  >
                    <span className="icon">delete</span>
                  </button>
                  <button
                    className="photo"
                    onClick={() => {
                      if (!isBusy) {
                        setFocusedId(id)
                        hideGif()
                      }
                    }}
                    aria-label={isBusy ? 'Processing photo' : 'View photo'}
                  >
                    <img
                      src={
                        isBusy ? imageData.inputs[id] : imageData.outputs[id]
                      }
                      draggable={false}
                      alt={isBusy ? 'Photo being processed' : 'Processed photo'}
                    />
                    <p className="emoji" aria-hidden="true">
                      {mode === 'custom' || mode.startsWith('custom-') ? '✏️' : modes[mode]?.emoji || '✨'}
                    </p>
                  </button>
                </li>
              ))
            : (() => {
                const emptyStateType = getEmptyStateType(videoActive, activeMode, photos)
                return emptyStateType && photoError ? (
                  <EmptyState
                    type="error"
                    errorMessage={photoError}
                    onRetry={handleRetryPhoto}
                  />
                ) : emptyStateType ? (
                  <EmptyState type={emptyStateType} />
                ) : null
              })()
          }
        </ul>
        {photos.filter(p => !p.isBusy).length > 0 && (
          <button
            className="button makeGif"
            onClick={handleMakeGif}
            disabled={gifInProgress}
            aria-label={gifInProgress ? 'Creating GIF' : 'Make GIF from photos'}
          >
            {gifInProgress ? 'One sec…' : 'Make GIF!'}
          </button>
        )}
      </div>

      {hoveredMode && (
        <div
          className={c('tooltip', {isFirst: hoveredMode.key === 'custom'})}
          role="tooltip"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: 'translateX(-50%)'
          }}
        >
          {hoveredMode.key === 'custom' && !hoveredMode.prompt.length ? (
            <p>Click to set a custom prompt</p>
          ) : (
            <>
              <p>"{hoveredMode.prompt}"</p>
              <h4>Prompt</h4>
            </>
          )}
        </div>
      )}

      {showBatchUpload && !isDemo && (
        <BatchUpload onClose={() => setShowBatchUpload(false)} />
      )}

      <CameraSettings
        isOpen={showCameraSettings}
        onClose={() => setShowCameraSettings(false)}
        facingMode={facingMode}
        onFacingModeChange={handleFacingModeChange}
        timerDuration={timerDuration}
        onTimerChange={handleTimerChange}
        burstMode={burstMode}
        onBurstModeChange={handleBurstModeChange}
      />
    </main>
  )
}
