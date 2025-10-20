/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react'
import c from 'clsx'
import { processBatch } from '../lib/actions-supabase'
import useStore from '../lib/store'
import imageData from '../lib/imageData'
import modes from '../lib/modes'

const MAX_FILES = 10

export default function BatchUpload({ onClose }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedMode, setSelectedMode] = useState(Object.keys(modes)[0])
  const [previews, setPreviews] = useState([])
  const [batchResults, setBatchResults] = useState(null)
  const [isDownloadingZip, setIsDownloadingZip] = useState(false)
  const batchProgress = useStore.use.batchUploadProgress()
  const photos = useStore.use.photos()

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files).slice(0, MAX_FILES)
    setSelectedFiles(files)
    setBatchResults(null) // Reset results when selecting new files

    // Generate previews
    const newPreviews = []
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push({
          name: file.name,
          url: e.target.result
        })
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleModeChange = (modeKey) => {
    setSelectedMode(modeKey)
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one image')
      return
    }

    const results = await processBatch(selectedFiles, selectedMode)

    if (results) {
      setBatchResults(results)
    }
  }

  const handleDownloadZip = async () => {
    if (!batchResults) return

    setIsDownloadingZip(true)

    try {
      // Dynamically import JSZip
      const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default

      const zip = new JSZip()
      const successfulResults = batchResults.filter(r => r.success)

      // Add each processed image to the zip
      for (const result of successfulResults) {
        const outputImage = imageData.outputs[result.id]
        if (outputImage) {
          // Convert base64 to blob
          const base64Data = outputImage.split(',')[1]
          const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(r => r.blob())

          // Use original filename with "_processed" suffix
          const originalName = result.fileName.replace(/\.[^/.]+$/, '')
          const extension = result.fileName.match(/\.[^/.]+$/)?.[0] || '.jpg'
          zip.file(`${originalName}_processed${extension}`, blob)
        }
      }

      // Generate zip and download
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gembooth_batch_${Date.now()}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error creating zip:', error)
      alert('Failed to create zip file. You can download images individually from the photo gallery.')
    } finally {
      setIsDownloadingZip(false)
    }
  }

  const handleReset = () => {
    setSelectedFiles([])
    setPreviews([])
    setBatchResults(null)
  }

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Watch for batch completion
  useEffect(() => {
    if (batchProgress === null && batchResults) {
      // Batch is complete
      console.log('Batch processing complete')
    }
  }, [batchProgress, batchResults])

  return (
    <div className="batchUploadModal" onClick={(e) => {
      if (e.target.className === 'batchUploadModal') {
        onClose()
      }
    }}>
      <div className="batchUpload">
        <div className="batchUpload__header">
          <h2>📸 Batch Upload</h2>
          <button className="circleBtn" onClick={onClose}>
            <span className="icon">close</span>
          </button>
        </div>

        <div className="batchUpload__content">
          {batchResults ? (
            // Results view
            <div className="batchUpload__results">
              <div className="batchUpload__resultsSummary">
                <h3>Batch Complete!</h3>
                <p>
                  {batchResults.filter(r => r.success).length} successful, {' '}
                  {batchResults.filter(r => !r.success).length} failed
                </p>
              </div>

              {batchResults.filter(r => !r.success).length > 0 && (
                <div className="batchUpload__errors">
                  <h4>Failed Images:</h4>
                  <ul>
                    {batchResults.filter(r => !r.success).map((result, i) => (
                      <li key={i}>
                        <span className="icon">error</span>
                        {result.fileName}: {result.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="batchUpload__actions">
                <button
                  className="button batchUpload__zipBtn"
                  onClick={handleDownloadZip}
                  disabled={isDownloadingZip || batchResults.filter(r => r.success).length === 0}
                >
                  {isDownloadingZip ? (
                    <>
                      <span className="icon">hourglass_empty</span>
                      Creating ZIP...
                    </>
                  ) : (
                    <>
                      <span className="icon">download</span>
                      Download All as ZIP
                    </>
                  )}
                </button>
                <button
                  className="button batchUpload__resetBtn"
                  onClick={handleReset}
                >
                  Upload Another Batch
                </button>
                <button
                  className="button batchUpload__closeBtn"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>

              <div className="batchUpload__note">
                <span className="icon">info</span>
                <p>Processed images are also available in your photo gallery below.</p>
              </div>
            </div>
          ) : !batchProgress ? (
            // Upload form
            <>
              <div className="batchUpload__instructions">
                <p>Upload up to {MAX_FILES} photos at once. All photos will be processed with the same effect.</p>
                <p className="batchUpload__proFeature">
                  <span className="icon">star</span> Pro/Premium Feature
                </p>
              </div>

              <div className="batchUpload__fileInput">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  onChange={handleFileSelect}
                  id="batchFileInput"
                  style={{ display: 'none' }}
                />
                <label htmlFor="batchFileInput" className="button batchUpload__selectBtn">
                  <span className="icon">add_photo_alternate</span>
                  Select Images ({selectedFiles.length}/{MAX_FILES})
                </label>
              </div>

              {previews.length > 0 && (
                <>
                  <div className="batchUpload__modeSelector">
                    <h3>Select Effect</h3>
                    <div className="batchUpload__modes">
                      {Object.entries(modes).slice(0, 12).map(([key, { name, emoji }]) => (
                        <button
                          key={key}
                          className={c('batchUpload__modeBtn', {
                            active: key === selectedMode
                          })}
                          onClick={() => handleModeChange(key)}
                          title={name}
                        >
                          <span>{emoji}</span>
                          <p>{name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="batchUpload__previews">
                    <h3>Selected Images ({previews.length})</h3>
                    <div className="batchUpload__grid">
                      {previews.map((preview, index) => (
                        <div key={index} className="batchUpload__previewItem">
                          <button
                            className="batchUpload__removeBtn circleBtn"
                            onClick={() => handleRemoveFile(index)}
                            title="Remove image"
                          >
                            <span className="icon">close</span>
                          </button>
                          <img src={preview.url} alt={preview.name} />
                          <p className="batchUpload__fileName" title={preview.name}>
                            {preview.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="button batchUpload__uploadBtn"
                    onClick={handleUpload}
                  >
                    <span className="icon">auto_awesome</span>
                    Process All ({selectedFiles.length} photos)
                  </button>
                </>
              )}
            </>
          ) : (
            // Progress view
            <div className="batchUpload__progress">
              <div className="batchUpload__progressIcon">
                <span className="icon rotating">autorenew</span>
              </div>
              <h3>Processing Images...</h3>
              <div className="batchUpload__progressBar">
                <div
                  className="batchUpload__progressFill"
                  style={{
                    width: `${(batchProgress.completed / batchProgress.total) * 100}%`
                  }}
                />
              </div>
              <p className="batchUpload__progressText">
                {batchProgress.completed} / {batchProgress.total} complete
              </p>
              <p className="batchUpload__currentFile">
                Processing image {batchProgress.current} of {batchProgress.total}...
              </p>
              <p className="batchUpload__progressNote">
                This may take a few minutes. Please don't close this window.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
