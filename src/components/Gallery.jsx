/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'
import { useAuth } from '../contexts/AuthContext'
import modes from '../lib/modes'
import '../styles/Gallery.css'

export default function Gallery() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('photos') // 'photos', 'gifs', 'generated', 'whiteboards', 'codrawings', 'pastforward'
  const [viewMode, setViewMode] = useState('grid') // 'grid', 'compact', 'list'
  const [photos, setPhotos] = useState([])
  const [gifs, setGifs] = useState([])
  const [generatedImages, setGeneratedImages] = useState([])
  const [whiteboards, setWhiteboards] = useState([])
  const [coDrawings, setCoDrawings] = useState([])
  const [pastForwardImages, setPastForwardImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null) // For modal
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    if (user) {
      fetchGalleryData()
    }
  }, [user])

  const fetchGalleryData = async () => {
    try {
      setLoading(true)

      // Fetch photos
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (photosError) throw photosError

      // Fetch GIFs
      const { data: gifsData, error: gifsError } = await supabase
        .from('gifs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (gifsError) throw gifsError

      // Fetch generated images
      const { data: generatedData, error: generatedError } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (generatedError) {
        console.error('Error fetching generated images:', generatedError)
        // Don't throw - table might not exist yet
        setGeneratedImages([])
      } else {
        setGeneratedImages(generatedData || [])
      }

      // Fetch whiteboards
      const { data: whiteboardsData, error: whiteboardsError } = await supabase
        .from('whiteboards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (whiteboardsError) {
        console.error('Error fetching whiteboards:', whiteboardsError)
        // Don't throw - table might not exist yet
        setWhiteboards([])
      } else {
        setWhiteboards(whiteboardsData || [])
      }

      // Fetch co-drawings
      const { data: coDrawingsData, error: coDrawingsError } = await supabase
        .from('codrawings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (coDrawingsError) {
        console.error('Error fetching co-drawings:', coDrawingsError)
        setCoDrawings([])
      } else {
        setCoDrawings(coDrawingsData || [])
      }

      // Fetch past forward images
      const { data: pastForwardData, error: pastForwardError } = await supabase
        .from('pastforward_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (pastForwardError) {
        console.error('Error fetching past forward images:', pastForwardError)
        setPastForwardImages([])
      } else {
        setPastForwardImages(pastForwardData || [])
      }

      setPhotos(photosData || [])
      setGifs(gifsData || [])
    } catch (error) {
      console.error('Error fetching gallery data:', error)
      alert('Error loading gallery. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return
    }

    try {
      setDeleting(id)

      if (type === 'photo') {
        // Delete from database
        const { error: dbError } = await supabase
          .from('photos')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (dbError) throw dbError

        // Delete from storage
        const inputFile = `${user.id}/${id}-input.jpg`
        const outputFile = `${user.id}/${id}-output.jpg`
        const inputFilePng = `${user.id}/${id}-input.png`
        const outputFilePng = `${user.id}/${id}-output.png`

        await supabase.storage.from('user-photos').remove([inputFile, outputFile, inputFilePng, outputFilePng])

        // Update local state
        setPhotos(photos.filter(p => p.id !== id))
      } else if (type === 'gif') {
        // Delete from database
        const { error: dbError } = await supabase
          .from('gifs')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (dbError) throw dbError

        // Delete from storage
        const gifFile = `${user.id}/${id}.gif`
        await supabase.storage.from('user-gifs').remove([gifFile])

        // Update local state
        setGifs(gifs.filter(g => g.id !== id))
      } else if (type === 'generated') {
        // Delete from database
        const { error: dbError } = await supabase
          .from('generated_images')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (dbError) throw dbError

        // Delete from storage
        const imageFile = `${user.id}/${id}.jpg`
        await supabase.storage.from('user-photos').remove([imageFile])

        // Update local state
        setGeneratedImages(generatedImages.filter(g => g.id !== id))
      } else if (type === 'whiteboard') {
        // Delete from database
        const { error: dbError } = await supabase
          .from('whiteboards')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (dbError) throw dbError

        // Delete from storage
        const whiteboardFile = `${user.id}/whiteboards/${id}.png`
        await supabase.storage.from('user-photos').remove([whiteboardFile])

        // Update local state
        setWhiteboards(whiteboards.filter(w => w.id !== id))
      } else if (type === 'codrawing') {
        // Delete from database
        const { error: dbError } = await supabase
          .from('codrawings')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (dbError) throw dbError

        // Delete from storage
        const imageFile = `${user.id}/codrawings/${id}.png`
        await supabase.storage.from('user-photos').remove([imageFile])

        // Update local state
        setCoDrawings(coDrawings.filter(c => c.id !== id))
      } else if (type === 'pastforward') {
        // Delete from database
        const { error: dbError } = await supabase
          .from('pastforward_images')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (dbError) throw dbError

        // Delete from storage
        const imageFile = `${user.id}/pastforward/${id}.jpg`
        await supabase.storage.from('user-photos').remove([imageFile])

        // Update local state
        setPastForwardImages(pastForwardImages.filter(p => p.id !== id))
      }

      // Close modal if the deleted item was open
      if (selectedItem?.id === id) {
        setSelectedItem(null)
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Error deleting item. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading:', error)
      alert('Error downloading file. Please try again.')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getModeDisplay = (modeKey) => {
    const mode = modes[modeKey]
    return mode ? `${mode.emoji} ${mode.name}` : modeKey
  }

  if (loading) {
    return (
      <div className="galleryPage">
        <div className="galleryContainer">
          <h1>My Gallery</h1>
          <div className="loadingMessage">Loading your gallery...</div>
        </div>
      </div>
    )
  }

  const hasPhotos = photos.length > 0
  const hasGifs = gifs.length > 0
  const hasGeneratedImages = generatedImages.length > 0
  const hasWhiteboards = whiteboards.length > 0
  const hasCoDrawings = coDrawings.length > 0
  const hasPastForward = pastForwardImages.length > 0
  const isEmpty = !hasPhotos && !hasGifs && !hasGeneratedImages && !hasWhiteboards && !hasCoDrawings && !hasPastForward

  return (
    <div className="galleryPage">
      <div className="galleryContainer">
        <h1>My Gallery</h1>

        {isEmpty ? (
          <div className="emptyGallery">
            <div className="emptyIcon">📷</div>
            <h2>Your gallery is empty</h2>
            <p>Start creating photos and GIFs to see them here!</p>
            <a href="/" className="button primary">Create Your First Photo</a>
          </div>
        ) : (
          <>
            <div className="galleryTabs">
              <button
                className={`tabButton ${activeTab === 'photos' ? 'active' : ''}`}
                onClick={() => setActiveTab('photos')}
              >
                📸 Photos ({photos.length})
              </button>
              <button
                className={`tabButton ${activeTab === 'gifs' ? 'active' : ''}`}
                onClick={() => setActiveTab('gifs')}
              >
                🎬 GIFs ({gifs.length})
              </button>
              <button
                className={`tabButton ${activeTab === 'generated' ? 'active' : ''}`}
                onClick={() => setActiveTab('generated')}
              >
                🎨 Generated ({generatedImages.length})
              </button>
              <button
                className={`tabButton ${activeTab === 'whiteboards' ? 'active' : ''}`}
                onClick={() => setActiveTab('whiteboards')}
              >
                ✏️ Whiteboards ({whiteboards.length})
              </button>
              <button
                className={`tabButton ${activeTab === 'codrawings' ? 'active' : ''}`}
                onClick={() => setActiveTab('codrawings')}
              >
                🖌️ Co-Drawings ({coDrawings.length})
              </button>
              <button
                className={`tabButton ${activeTab === 'pastforward' ? 'active' : ''}`}
                onClick={() => setActiveTab('pastforward')}
              >
                ⏰ Past Forward ({pastForwardImages.length})
              </button>
            </div>

            {/* View Mode Selector */}
            <div className="viewModeSelector">
              <span className="viewModeLabel">View:</span>
              <div className="viewModeButtons">
                <button
                  className={`viewModeButton ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View (6 per row)"
                >
                  <span className="viewModeIcon">▦</span>
                  <span className="viewModeText">Grid</span>
                </button>
                <button
                  className={`viewModeButton ${viewMode === 'compact' ? 'active' : ''}`}
                  onClick={() => setViewMode('compact')}
                  title="Compact View (9 per row)"
                >
                  <span className="viewModeIcon">▤</span>
                  <span className="viewModeText">Compact</span>
                </button>
                <button
                  className={`viewModeButton ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <span className="viewModeIcon">☰</span>
                  <span className="viewModeText">List</span>
                </button>
              </div>
            </div>

            {activeTab === 'photos' && (
              <div className={`galleryGrid ${viewMode}`}>
                {photos.map(photo => (
                  <div key={photo.id} className="galleryItem">
                    <div
                      className="galleryItemImage"
                      onClick={() => setSelectedItem({ ...photo, type: 'photo' })}
                    >
                      <img src={photo.output_image_url} alt="Processed photo" />
                      <div className="galleryItemOverlay">
                        <span className="viewLabel">Click to view</span>
                      </div>
                    </div>
                    <div className="galleryItemInfo">
                      <div className="galleryItemMode">{getModeDisplay(photo.mode)}</div>
                      <div className="galleryItemDate">{formatDate(photo.created_at)}</div>
                    </div>
                    <div className="galleryItemActions">
                      <button
                        className="iconButton"
                        onClick={() => handleDownload(photo.output_image_url, `gembooth-${photo.id}.jpg`)}
                        title="Download"
                      >
                        ⬇️
                      </button>
                      <button
                        className="iconButton deleteButton"
                        onClick={() => handleDelete(photo.id, 'photo')}
                        disabled={deleting === photo.id}
                        title="Delete"
                      >
                        {deleting === photo.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gifs' && (
              <div className={`galleryGrid ${viewMode}`}>
                {gifs.map(gif => (
                  <div key={gif.id} className="galleryItem">
                    <div
                      className="galleryItemImage"
                      onClick={() => setSelectedItem({ ...gif, type: 'gif' })}
                    >
                      <img src={gif.gif_url} alt="GIF" />
                      <div className="galleryItemOverlay">
                        <span className="viewLabel">Click to view</span>
                      </div>
                    </div>
                    <div className="galleryItemInfo">
                      <div className="galleryItemMode">🎬 GIF</div>
                      <div className="galleryItemDate">{formatDate(gif.created_at)}</div>
                    </div>
                    <div className="galleryItemActions">
                      <button
                        className="iconButton"
                        onClick={() => handleDownload(gif.gif_url, `gembooth-${gif.id}.gif`)}
                        title="Download"
                      >
                        ⬇️
                      </button>
                      <button
                        className="iconButton deleteButton"
                        onClick={() => handleDelete(gif.id, 'gif')}
                        disabled={deleting === gif.id}
                        title="Delete"
                      >
                        {deleting === gif.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'generated' && (
              <div className={`galleryGrid ${viewMode}`}>
                {generatedImages.map(image => (
                  <div key={image.id} className="galleryItem">
                    <div
                      className="galleryItemImage"
                      onClick={() => setSelectedItem({ ...image, type: 'generated' })}
                    >
                      <img src={image.image_url} alt="Generated image" />
                      <div className="galleryItemOverlay">
                        <span className="viewLabel">Click to view</span>
                      </div>
                    </div>
                    <div className="galleryItemInfo">
                      <div className="galleryItemMode">🎨 AI Generated</div>
                      <div className="galleryItemDate">{formatDate(image.created_at)}</div>
                    </div>
                    <div className="galleryItemActions">
                      <button
                        className="iconButton"
                        onClick={() => handleDownload(image.image_url, `generated-${image.id}.jpg`)}
                        title="Download"
                      >
                        ⬇️
                      </button>
                      <button
                        className="iconButton deleteButton"
                        onClick={() => handleDelete(image.id, 'generated')}
                        disabled={deleting === image.id}
                        title="Delete"
                      >
                        {deleting === image.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'whiteboards' && (
              <div className={`galleryGrid ${viewMode}`}>
                {whiteboards.map(whiteboard => (
                  <div key={whiteboard.id} className="galleryItem">
                    <div
                      className="galleryItemImage"
                      onClick={() => setSelectedItem({ ...whiteboard, type: 'whiteboard' })}
                    >
                      <img src={whiteboard.image_url} alt="Whiteboard" />
                      <div className="galleryItemOverlay">
                        <span className="viewLabel">Click to view</span>
                      </div>
                    </div>
                    <div className="galleryItemInfo">
                      <div className="galleryItemMode">✏️ Whiteboard</div>
                      <div className="galleryItemDate">{formatDate(whiteboard.created_at)}</div>
                    </div>
                    <div className="galleryItemActions">
                      <button
                        className="iconButton"
                        onClick={() => handleDownload(whiteboard.image_url, `whiteboard-${whiteboard.id}.png`)}
                        title="Download"
                      >
                        ⬇️
                      </button>
                      <button
                        className="iconButton deleteButton"
                        onClick={() => handleDelete(whiteboard.id, 'whiteboard')}
                        disabled={deleting === whiteboard.id}
                        title="Delete"
                      >
                        {deleting === whiteboard.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'codrawings' && (
              <div className={`galleryGrid ${viewMode}`}>
                {coDrawings.map(drawing => (
                  <div key={drawing.id} className="galleryItem">
                    <div
                      className="galleryItemImage"
                      onClick={() => setSelectedItem({ ...drawing, type: 'codrawing' })}
                    >
                      <img src={drawing.image_url} alt="Co-Drawing" />
                      <div className="galleryItemOverlay">
                        <span className="viewLabel">Click to view</span>
                      </div>
                    </div>
                    <div className="galleryItemInfo">
                      <div className="galleryItemMode">🖌️ Co-Drawing</div>
                      <div className="galleryItemPrompt">{drawing.prompt}</div>
                      <div className="galleryItemDate">{formatDate(drawing.created_at)}</div>
                    </div>
                    <div className="galleryItemActions">
                      <button
                        className="iconButton"
                        onClick={() => handleDownload(drawing.image_url, `codrawing-${drawing.id}.png`)}
                        title="Download"
                      >
                        ⬇️
                      </button>
                      <button
                        className="iconButton deleteButton"
                        onClick={() => handleDelete(drawing.id, 'codrawing')}
                        disabled={deleting === drawing.id}
                        title="Delete"
                      >
                        {deleting === drawing.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'pastforward' && (
              <div className={`galleryGrid ${viewMode}`}>
                {pastForwardImages.map(image => (
                  <div key={image.id} className="galleryItem">
                    <div
                      className="galleryItemImage"
                      onClick={() => setSelectedItem({ ...image, type: 'pastforward' })}
                    >
                      <img src={image.image_url} alt={`Past Forward - ${image.decade}`} />
                      <div className="galleryItemOverlay">
                        <span className="viewLabel">Click to view</span>
                      </div>
                    </div>
                    <div className="galleryItemInfo">
                      <div className="galleryItemMode">⏰ {image.decade}</div>
                      <div className="galleryItemDate">{formatDate(image.created_at)}</div>
                    </div>
                    <div className="galleryItemActions">
                      <button
                        className="iconButton"
                        onClick={() => handleDownload(image.image_url, `pastforward-${image.decade}-${image.id}.jpg`)}
                        title="Download"
                      >
                        ⬇️
                      </button>
                      <button
                        className="iconButton deleteButton"
                        onClick={() => handleDelete(image.id, 'pastforward')}
                        disabled={deleting === image.id}
                        title="Delete"
                      >
                        {deleting === image.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for full-size viewing */}
      {selectedItem && (
        <div className="galleryModal" onClick={() => setSelectedItem(null)}>
          <div className="galleryModalContent" onClick={(e) => e.stopPropagation()}>
            <button
              className="galleryModalClose"
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </button>

            <div className="galleryModalImage">
              {selectedItem.type === 'photo' ? (
                <div className="modalPhotoComparison">
                  <div className="modalComparisonItem">
                    <h3>Original</h3>
                    <img src={selectedItem.input_image_url} alt="Original" />
                  </div>
                  <div className="modalComparisonItem">
                    <h3>Processed</h3>
                    <img src={selectedItem.output_image_url} alt="Processed" />
                  </div>
                </div>
              ) : selectedItem.type === 'gif' ? (
                <img src={selectedItem.gif_url} alt="GIF" />
              ) : selectedItem.type === 'whiteboard' ? (
                <img src={selectedItem.image_url} alt="Whiteboard" />
              ) : (
                <img src={selectedItem.image_url} alt="Generated image" />
              )}
            </div>

            <div className="galleryModalInfo">
              <div className="modalInfoRow">
                <span className="modalLabel">Type:</span>
                <span className="modalValue">
                  {selectedItem.type === 'photo'
                    ? getModeDisplay(selectedItem.mode)
                    : selectedItem.type === 'gif'
                    ? '🎬 GIF'
                    : selectedItem.type === 'whiteboard'
                    ? '✏️ Whiteboard'
                    : '🎨 AI Generated'}
                </span>
              </div>
              {selectedItem.prompt && (
                <div className="modalInfoRow">
                  <span className="modalLabel">Prompt:</span>
                  <span className="modalValue">{selectedItem.prompt}</span>
                </div>
              )}
              <div className="modalInfoRow">
                <span className="modalLabel">Created:</span>
                <span className="modalValue">{formatDate(selectedItem.created_at)}</span>
              </div>
            </div>

            <div className="galleryModalActions">
              <button
                className="button"
                onClick={() => {
                  const url = selectedItem.type === 'photo'
                    ? selectedItem.output_image_url
                    : selectedItem.type === 'gif'
                    ? selectedItem.gif_url
                    : selectedItem.image_url
                  const extension = selectedItem.type === 'gif' ? 'gif' : selectedItem.type === 'whiteboard' ? 'png' : 'jpg'
                  const filename = `gembooth-${selectedItem.id}.${extension}`
                  handleDownload(url, filename)
                }}
              >
                ⬇️ Download
              </button>
              <button
                className="button deleteButton"
                onClick={() => {
                  handleDelete(selectedItem.id, selectedItem.type)
                }}
                disabled={deleting === selectedItem.id}
              >
                {deleting === selectedItem.id ? '⏳ Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
