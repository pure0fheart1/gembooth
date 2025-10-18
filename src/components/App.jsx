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

// CSS filter approximations for live preview
const filterPresets = {
  renaissance: 'sepia(0.5) saturate(1.2) contrast(1.1) brightness(1.05)',
  cartoon: 'saturate(1.8) brightness(1.15) contrast(1.2)',
  statue: 'grayscale(1) contrast(1.3) brightness(1.1)',
  banana: 'hue-rotate(30deg) saturate(2) brightness(1.2)',
  '80s': 'saturate(1.6) brightness(1.1) contrast(1.15) hue-rotate(-10deg)',
  '19century': 'sepia(0.8) contrast(0.85) brightness(0.95) saturate(0.7)',
  anime: 'saturate(1.5) brightness(1.1) contrast(1.25)',
  psychedelic: 'hue-rotate(90deg) saturate(2.5) contrast(1.2)',
  '8bit': 'saturate(1.8) contrast(1.3) brightness(1.1)',
  beard: 'contrast(1.05) saturate(1.05)',
  comic: 'saturate(1.6) contrast(1.4) brightness(1.05)',
  old: 'grayscale(0.6) sepia(0.3) contrast(0.9) brightness(0.95)',
  filmnoir: 'grayscale(1) contrast(1.5) brightness(0.95)',
  claymation: 'saturate(1.3) contrast(1.1) brightness(1.05)',
  cyberpunk: 'hue-rotate(180deg) saturate(1.8) contrast(1.2) brightness(1.1)',
  oilpainting: 'saturate(1.3) contrast(1.15) brightness(1.05)',
  popart: 'saturate(2) contrast(1.5) brightness(1.1)',
  zombie: 'sepia(0.3) hue-rotate(60deg) saturate(0.6) contrast(1.2) brightness(0.85)',
  superhero: 'saturate(1.5) contrast(1.3) brightness(1.15)',
  medievalknight: 'sepia(0.4) saturate(1.2) contrast(1.15)',
  stainedglass: 'saturate(2) hue-rotate(30deg) contrast(1.2) brightness(1.1)',
  watercolor: 'saturate(1.2) brightness(1.05) contrast(0.95) opacity(0.95)',
  custom: 'saturate(1.1) contrast(1.05)'
}

export default function App({ isDemo = false, photoLimit = null }) {
  // Select actions based on mode
  const actions = isDemo ? demoActions : supabaseActions
  const photos = useStore.use.photos()
  const customPrompt = useStore.use.customPrompt()
  const activeMode = useStore.use.activeMode()
  const gifInProgress = useStore.use.gifInProgress()
  const gifUrl = useStore.use.gifUrl()
  const favoriteModes = useStore.use.favoriteModes()
  const [videoActive, setVideoActive] = useState(false)
  const [didInitVideo, setDidInitVideo] = useState(false)
  const [focusedId, setFocusedId] = useState(null)
  const [didJustSnap, setDidJustSnap] = useState(false)
  const [hoveredMode, setHoveredMode] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({top: 0, left: 0})
  const [showCustomPrompt, setShowCustomPrompt] = useState(false)
  const [photoError, setPhotoError] = useState(null)
  const [showBatchUpload, setShowBatchUpload] = useState(false)
  const [previewEnabled, setPreviewEnabled] = useState(true)
  const videoRef = useRef(null)

  // Destructure action methods
  const { deletePhoto, setMode, makeGif, hideGif, toggleFavorite, setCustomPrompt } = actions

  // Load favorite modes on mount (only in authenticated mode)
  useEffect(() => {
    if (!isDemo && actions.loadFavoriteModes) {
      actions.loadFavoriteModes()
    }
  }, [isDemo, actions])

  const startVideo = async () => {
    setDidInitVideo(true)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {width: {ideal: 1920}, height: {ideal: 1080}},
      audio: false,
      facingMode: {ideal: 'user'}
    })
    setVideoActive(true)
    videoRef.current.srcObject = stream

    const {width, height} = stream.getVideoTracks()[0].getSettings()
    const squareSize = Math.min(width, height)
    canvas.width = squareSize
    canvas.height = squareSize
  }

  const takePhoto = async () => {
    const video = videoRef.current
    const {videoWidth, videoHeight} = video
    const squareSize = canvas.width
    const sourceSize = Math.min(videoWidth, videoHeight)
    const sourceX = (videoWidth - sourceSize) / 2
    const sourceY = (videoHeight - sourceSize) / 2

    ctx.clearRect(0, 0, squareSize, squareSize)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
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

    // Clear any previous errors
    setPhotoError(null)

    const result = await actions.snapPhoto(canvas.toDataURL('image/jpeg'))

    // Handle errors from demo mode
    if (result && result.error) {
      setPhotoError(result.error)
      return
    }

    setDidJustSnap(true)
    setTimeout(() => setDidJustSnap(false), 1000)
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

  // Handle GIF creation with demo mode support
  const handleMakeGif = async () => {
    const result = await makeGif()
    if (result && result.error) {
      alert(result.error)
    }
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
          style={{
            filter: previewEnabled && activeMode && filterPresets[activeMode]
              ? filterPresets[activeMode]
              : 'none',
            transition: 'filter 0.3s ease'
          }}
        />
        {didJustSnap && <div className="flash" />}
        {previewEnabled && videoActive && activeMode && (
          <div className="previewIndicator">
            <span className="icon">visibility</span>
            <span>Live Preview</span>
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
            <button onClick={takePhoto} className="shutter">
              <span className="icon">camera</span>
            </button>

            <button
              onClick={() => setPreviewEnabled(!previewEnabled)}
              className={c('previewToggle', {active: previewEnabled})}
              title={previewEnabled ? 'Disable live preview' : 'Enable live preview'}
              aria-label={previewEnabled ? 'Disable live preview' : 'Enable live preview'}
            >
              <span className="icon">{previewEnabled ? 'visibility' : 'visibility_off'}</span>
              <span className="previewLabel">Preview</span>
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
                      {mode === 'custom' ? '✏️' : modes[mode].emoji}
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
    </main>
  )
}
