/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { generateEditedImage, generateFilteredImage, generateAdjustedImage } from './PixShop/geminiService';
import Header from './PixShop/Header';
import Spinner from './PixShop/Spinner';
import FilterPanel from './PixShop/FilterPanel';
import AdjustmentPanel from './PixShop/AdjustmentPanel';
import CropPanel from './PixShop/CropPanel';
import { UndoIcon, RedoIcon, EyeIcon } from './PixShop/icons';
import StartScreen from './PixShop/StartScreen';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { checkUsageLimit, incrementUsage } from '../lib/usageTracking';
import '../styles/PixShop.css';

// Helper to convert a data URL string to a File object
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  if (arr.length < 2) throw new Error("Invalid data URL");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const PixShop = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editHotspot, setEditHotspot] = useState(null);
  const [displayHotspot, setDisplayHotspot] = useState(null);
  const [activeTab, setActiveTab] = useState('retouch');

  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [aspect, setAspect] = useState();
  const [isComparing, setIsComparing] = useState(false);
  const imgRef = useRef(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const currentImage = history[historyIndex] ?? null;
  const originalImage = history[0] ?? null;

  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);

  // Effect to create and revoke object URLs safely for the current image
  useEffect(() => {
    if (currentImage) {
      const url = URL.createObjectURL(currentImage);
      setCurrentImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCurrentImageUrl(null);
    }
  }, [currentImage]);

  // Effect to create and revoke object URLs safely for the original image
  useEffect(() => {
    if (originalImage) {
      const url = URL.createObjectURL(originalImage);
      setOriginalImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setOriginalImageUrl(null);
    }
  }, [originalImage]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const addImageToHistory = useCallback((newImageFile) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newImageFile);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    // Reset transient states after an action
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, [history, historyIndex]);

  const handleImageUpload = useCallback((file) => {
    setError(null);
    setHistory([file]);
    setHistoryIndex(0);
    setEditHotspot(null);
    setDisplayHotspot(null);
    setActiveTab('retouch');
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!currentImage) {
      setError('No image loaded to edit.');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a description for your edit.');
      return;
    }

    if (!editHotspot) {
      setError('Please click on the image to select an area to edit.');
      return;
    }

    // Check if user is logged in
    if (!user) {
      setError('Please log in to use PixShop');
      return;
    }

    // Check usage limit before proceeding
    const usageCheck = await checkUsageLimit(user.id, 'pixshop');
    if (!usageCheck.allowed) {
      setError(usageCheck.message || 'You have reached your PixShop limit for this month. Please upgrade your plan to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const editedImageUrl = await generateEditedImage(currentImage, prompt, editHotspot);
      const newImageFile = dataURLtoFile(editedImageUrl, `edited-${Date.now()}.png`);
      addImageToHistory(newImageFile);
      setEditHotspot(null);
      setDisplayHotspot(null);

      // Increment usage after successful edit
      await incrementUsage(user.id, 'pixshop');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate the image. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentImage, prompt, editHotspot, addImageToHistory, user]);

  const handleApplyFilter = useCallback(async (filterPrompt) => {
    if (!currentImage) {
      setError('No image loaded to apply a filter to.');
      return;
    }

    // Check if user is logged in
    if (!user) {
      setError('Please log in to use PixShop');
      return;
    }

    // Check usage limit before proceeding
    const usageCheck = await checkUsageLimit(user.id, 'pixshop');
    if (!usageCheck.allowed) {
      setError(usageCheck.message || 'You have reached your PixShop limit for this month. Please upgrade your plan to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const filteredImageUrl = await generateFilteredImage(currentImage, filterPrompt);
      const newImageFile = dataURLtoFile(filteredImageUrl, `filtered-${Date.now()}.png`);
      addImageToHistory(newImageFile);

      // Increment usage after successful filter
      await incrementUsage(user.id, 'pixshop');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to apply the filter. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentImage, addImageToHistory, user]);

  const handleApplyAdjustment = useCallback(async (adjustmentPrompt) => {
    if (!currentImage) {
      setError('No image loaded to apply an adjustment to.');
      return;
    }

    // Check if user is logged in
    if (!user) {
      setError('Please log in to use PixShop');
      return;
    }

    // Check usage limit before proceeding
    const usageCheck = await checkUsageLimit(user.id, 'pixshop');
    if (!usageCheck.allowed) {
      setError(usageCheck.message || 'You have reached your PixShop limit for this month. Please upgrade your plan to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const adjustedImageUrl = await generateAdjustedImage(currentImage, adjustmentPrompt);
      const newImageFile = dataURLtoFile(adjustedImageUrl, `adjusted-${Date.now()}.png`);
      addImageToHistory(newImageFile);

      // Increment usage after successful adjustment
      await incrementUsage(user.id, 'pixshop');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to apply the adjustment. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentImage, addImageToHistory, user]);

  const handleApplyCrop = useCallback(() => {
    if (!completedCrop || !imgRef.current) {
      setError('Please select an area to crop.');
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('Could not process the crop.');
      return;
    }

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    const croppedImageUrl = canvas.toDataURL('image/png');
    const newImageFile = dataURLtoFile(croppedImageUrl, `cropped-${Date.now()}.png`);
    addImageToHistory(newImageFile);

  }, [completedCrop, addImageToHistory]);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      setHistoryIndex(historyIndex - 1);
      setEditHotspot(null);
      setDisplayHotspot(null);
    }
  }, [canUndo, historyIndex]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      setHistoryIndex(historyIndex + 1);
      setEditHotspot(null);
      setDisplayHotspot(null);
    }
  }, [canRedo, historyIndex]);

  const handleReset = useCallback(() => {
    if (history.length > 0) {
      setHistoryIndex(0);
      setError(null);
      setEditHotspot(null);
      setDisplayHotspot(null);
    }
  }, [history]);

  const handleUploadNew = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
    setError(null);
    setPrompt('');
    setEditHotspot(null);
    setDisplayHotspot(null);
  }, []);

  const handleDownload = useCallback(() => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(currentImage);
      link.download = `edited-${currentImage.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
  }, [currentImage]);

  const handleFileSelect = (files) => {
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  const handleImageClick = (e) => {
    if (activeTab !== 'retouch') return;

    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDisplayHotspot({ x: offsetX, y: offsetY });

    const { naturalWidth, naturalHeight, clientWidth, clientHeight } = img;
    const scaleX = naturalWidth / clientWidth;
    const scaleY = naturalHeight / clientHeight;

    const originalX = Math.round(offsetX * scaleX);
    const originalY = Math.round(offsetY * scaleY);

    setEditHotspot({ x: originalX, y: originalY });
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="pixshopError">
          <h2 className="pixshopErrorTitle">An Error Occurred</h2>
          <p className="pixshopErrorMessage">{error}</p>
          <button onClick={() => setError(null)} className="pixshopErrorButton">
            Try Again
          </button>
        </div>
      );
    }

    if (!currentImageUrl) {
      return <StartScreen onFileSelect={handleFileSelect} />;
    }

    const imageDisplay = (
      <div className="pixshopImageWrapper">
        {/* Base image is the original, always at the bottom */}
        {originalImageUrl && (
          <img
            key={originalImageUrl}
            src={originalImageUrl}
            alt="Original"
            className="pixshopImage pixshopImageOriginal"
          />
        )}
        {/* The current image is an overlay that fades in/out for comparison */}
        <img
          ref={imgRef}
          key={currentImageUrl}
          src={currentImageUrl}
          alt="Current"
          onClick={handleImageClick}
          className={`pixshopImage pixshopImageCurrent ${isComparing ? 'comparing' : 'normal'} ${activeTab === 'retouch' ? 'pixshopImageClickable' : ''}`}
        />
      </div>
    );

    // For ReactCrop, we need a single image element. We'll use the current one.
    const cropImageElement = (
      <img
        ref={imgRef}
        key={`crop-${currentImageUrl}`}
        src={currentImageUrl}
        alt="Crop this image"
        className="pixshopImage"
      />
    );

    return (
      <div className="pixshopEditorContent">
        <div className="pixshopImageContainer">
          {isLoading && (
            <div className="pixshopLoadingOverlay">
              <Spinner />
              <p className="pixshopLoadingText">AI is working its magic...</p>
            </div>
          )}

          {activeTab === 'crop' ? (
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)}
              aspect={aspect}
              className="pixshopCropContainer"
            >
              {cropImageElement}
            </ReactCrop>
          ) : imageDisplay}

          {displayHotspot && !isLoading && activeTab === 'retouch' && (
            <div
              className="pixshopHotspot"
              style={{ left: `${displayHotspot.x}px`, top: `${displayHotspot.y}px` }}
            >
              <div className="pixshopHotspotPing"></div>
            </div>
          )}
        </div>

        <div className="pixshopTabs">
          {['retouch', 'crop', 'adjust', 'filters'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pixshopTab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'retouch' && (
            <div className="pixshopPanel">
              <p className="pixshopRetouchHint">
                {editHotspot ? 'Great! Now describe your localized edit below.' : 'Click an area on the image to make a precise edit.'}
              </p>
              <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }} className="pixshopRetouchForm">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={editHotspot ? "e.g., 'change my shirt color to blue'" : "First click a point on the image"}
                  className="pixshopRetouchInput"
                  disabled={isLoading || !editHotspot}
                />
                <button
                  type="submit"
                  className="pixshopRetouchButton"
                  disabled={isLoading || !prompt.trim() || !editHotspot}
                >
                  Generate
                </button>
              </form>
            </div>
          )}
          {activeTab === 'crop' && <CropPanel onApplyCrop={handleApplyCrop} onSetAspect={setAspect} isLoading={isLoading} isCropping={!!completedCrop?.width && completedCrop.width > 0} />}
          {activeTab === 'adjust' && <AdjustmentPanel onApplyAdjustment={handleApplyAdjustment} isLoading={isLoading} />}
          {activeTab === 'filters' && <FilterPanel onApplyFilter={handleApplyFilter} isLoading={isLoading} />}
        </div>

        <div className="pixshopActions">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="pixshopActionButton"
            aria-label="Undo last action"
          >
            <UndoIcon />
            Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="pixshopActionButton"
            aria-label="Redo last action"
          >
            <RedoIcon />
            Redo
          </button>

          <div className="pixshopDivider"></div>

          {canUndo && (
            <button
              onMouseDown={() => setIsComparing(true)}
              onMouseUp={() => setIsComparing(false)}
              onMouseLeave={() => setIsComparing(false)}
              onTouchStart={() => setIsComparing(true)}
              onTouchEnd={() => setIsComparing(false)}
              className="pixshopActionButton"
              aria-label="Press and hold to see original image"
            >
              <EyeIcon />
              Compare
            </button>
          )}

          <button
            onClick={handleReset}
            disabled={!canUndo}
            className="pixshopActionButton pixshopResetButton"
          >
            Reset
          </button>
          <button
            onClick={handleUploadNew}
            className="pixshopActionButton"
          >
            Upload New
          </button>

          <button
            onClick={handleDownload}
            className="pixshopActionButton pixshopDownloadButton"
          >
            Download Image
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pixshopContainer">
      <Header />
      <main className={`pixshopMain ${currentImage ? 'hasImage' : 'noImage'}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default PixShop;
