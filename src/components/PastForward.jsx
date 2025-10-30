import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase/client';
import { Download, RefreshCw, Upload, Trash2 } from 'lucide-react';
import { checkUsageLimit, incrementUsage } from '../lib/usageTracking';
import '../styles/PastForward.css';

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: 'AIzaSyBjosltDAxf1XQXoxO7ogY6BXO3UmD191A' });

const DECADES = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'];

const POSITIONS = [
  { top: '5%', left: '10%', rotate: -8 },
  { top: '15%', left: '60%', rotate: 5 },
  { top: '45%', left: '5%', rotate: 3 },
  { top: '2%', left: '35%', rotate: 10 },
  { top: '40%', left: '70%', rotate: -12 },
  { top: '50%', left: '38%', rotate: -3 },
];

const PolaroidCard = ({ imageUrl, caption, status, error, position, onRegenerate, onDownload, isMobile }) => {
  const [isDeveloped, setIsDeveloped] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (status === 'pending') {
      setIsDeveloped(false);
      setIsImageLoaded(false);
    }
    if (status === 'done' && imageUrl) {
      setIsDeveloped(false);
      setIsImageLoaded(false);
    }
  }, [imageUrl, status]);

  useEffect(() => {
    if (isImageLoaded) {
      const timer = setTimeout(() => {
        setIsDeveloped(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isImageLoaded]);

  const cardContent = (
    <div className="polaroidCard">
      <div className="polaroidImageContainer">
        {status === 'pending' && (
          <div className="polaroidLoading">
            <div className="polaroidSpinner" />
          </div>
        )}
        {status === 'error' && (
          <div className="polaroidError">
            <svg className="polaroidErrorIcon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="polaroidErrorText">{error || 'Failed to generate'}</p>
          </div>
        )}
        {status === 'done' && imageUrl && (
          <>
            <div className="polaroidControls">
              <button
                onClick={() => onDownload?.(caption, imageUrl)}
                className="polaroidControlButton"
                title="Download"
              >
                <Download className="polaroidControlIcon" />
              </button>
              <button
                onClick={() => onRegenerate?.(caption)}
                className="polaroidControlButton"
                title="Regenerate"
              >
                <RefreshCw className="polaroidControlIcon" />
              </button>
            </div>
            <div
              className={`polaroidDevelopOverlay ${isDeveloped ? 'polaroidDevelopOverlayDone' : ''}`}
            />
            <img
              src={imageUrl}
              alt={caption}
              onLoad={() => setIsImageLoaded(true)}
              className={`polaroidImage ${isDeveloped ? 'polaroidImageDeveloped' : ''}`}
            />
          </>
        )}
        {status === 'done' && !imageUrl && (
          <div className="polaroidPlaceholder">
            <svg className="polaroidPlaceholderIcon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Upload Photo</span>
          </div>
        )}
      </div>
      <div className="polaroidCaption">
        <p>{caption}</p>
      </div>
    </div>
  );

  if (isMobile) {
    return <div className="polaroidWrapper">{cardContent}</div>;
  }

  return (
    <div
      className="polaroidWrapperDesktop"
      style={{
        top: position?.top,
        left: position?.left,
        transform: `rotate(${position?.rotate}deg)`,
      }}
    >
      {cardContent}
    </div>
  );
};

export default function PastForward() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImages, setGeneratedImages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [appState, setAppState] = useState('idle'); // 'idle', 'image-uploaded', 'generating', 'results-shown'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const fileInputRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setAppState('image-uploaded');
        setGeneratedImages({});
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDecadeImage = async (imageDataUrl, prompt) => {
    const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!match) {
      throw new Error("Invalid image data URL format");
    }
    const [, mimeType, base64Data] = match;

    const imagePart = {
      inlineData: { mimeType, data: base64Data },
    };

    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
    });

    const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePartFromResponse?.inlineData) {
      const { mimeType, data } = imagePartFromResponse.inlineData;
      return `data:${mimeType};base64,${data}`;
    }

    throw new Error('The AI model did not return an image');
  };

  const handleGenerateClick = async () => {
    if (!uploadedImage) return;

    // Check if user is logged in
    if (!user) {
      alert('Please log in to use Past Forward');
      return;
    }

    // Check usage limit before proceeding
    const usageCheck = await checkUsageLimit(user.id, 'pastforward');
    if (!usageCheck.allowed) {
      alert(usageCheck.message || 'You have reached your Past Forward limit for this month. Please upgrade your plan to continue.');
      return;
    }

    setIsLoading(true);
    setAppState('generating');

    const initialImages = {};
    DECADES.forEach(decade => {
      initialImages[decade] = { status: 'pending' };
    });
    setGeneratedImages(initialImages);

    const processDecade = async (decade) => {
      try {
        const prompt = `Reimagine the person in this photo in the style of the ${decade}. This includes clothing, hairstyle, photo quality, and the overall aesthetic of that decade. The output must be a photorealistic image showing the person clearly.`;
        const resultUrl = await generateDecadeImage(uploadedImage, prompt);
        setGeneratedImages(prev => ({
          ...prev,
          [decade]: { status: 'done', url: resultUrl },
        }));
      } catch (err) {
        setGeneratedImages(prev => ({
          ...prev,
          [decade]: { status: 'error', error: err.message },
        }));
      }
    };

    // Process 2 decades at a time
    const concurrencyLimit = 2;
    const decadesQueue = [...DECADES];

    const workers = Array(concurrencyLimit).fill(null).map(async () => {
      while (decadesQueue.length > 0) {
        const decade = decadesQueue.shift();
        if (decade) {
          await processDecade(decade);
        }
      }
    });

    await Promise.all(workers);

    // Increment usage after successful generation of all decade images
    await incrementUsage(user.id, 'pastforward');

    setIsLoading(false);
    setAppState('results-shown');
  };

  const handleRegenerateDecade = async (decade) => {
    if (!uploadedImage || generatedImages[decade]?.status === 'pending') {
      return;
    }

    setGeneratedImages(prev => ({
      ...prev,
      [decade]: { status: 'pending' },
    }));

    try {
      const prompt = `Reimagine the person in this photo in the style of the ${decade}. This includes clothing, hairstyle, photo quality, and the overall aesthetic of that decade. The output must be a photorealistic image showing the person clearly.`;
      const resultUrl = await generateDecadeImage(uploadedImage, prompt);
      setGeneratedImages(prev => ({
        ...prev,
        [decade]: { status: 'done', url: resultUrl },
      }));
    } catch (err) {
      setGeneratedImages(prev => ({
        ...prev,
        [decade]: { status: 'error', error: err.message },
      }));
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setGeneratedImages({});
    setAppState('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadImage = (decade, imageUrl) => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `past-forward-${decade}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveAllToGallery = async () => {
    if (!user) {
      alert('Please log in to save your time travel photos to the gallery.');
      return;
    }

    const completedImages = Object.entries(generatedImages)
      .filter(([, image]) => image.status === 'done' && image.url);

    if (completedImages.length === 0) {
      alert('No images to save yet. Please wait for generation to complete.');
      return;
    }

    setIsSaving(true);

    try {
      for (const [decade, image] of completedImages) {
        const response = await fetch(image.url);
        const blob = await response.blob();

        const imageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const filePath = `${user.id}/pastforward/${imageId}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('user-photos')
          .upload(filePath, blob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('user-photos')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('pastforward_images')
          .insert({
            user_id: user.id,
            image_url: publicUrl,
            decade: decade,
            original_image: uploadedImage,
          });

        if (dbError) throw dbError;
      }

      alert(`Saved ${completedImages.length} images to your gallery!`);
    } catch (error) {
      console.error('Error saving images:', error);
      alert('Failed to save images. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pastForwardPage">
      <header className="pastForwardHeader">
        <div>
          <h1 className="pastForwardTitle">
            <span className="pastForwardTitleGradient">Past Forward</span>
          </h1>
          <p className="pastForwardSubtitle">Travel through the decades and see yourself in different eras</p>
        </div>
      </header>

      <main className="pastForwardMain">
        {appState === 'idle' && (
          <div className="pastForwardUpload">
            <div className="pastForwardUploadCard">
              <Upload className="pastForwardUploadIcon" />
              <h2 className="pastForwardUploadTitle">Start Your Journey</h2>
              <p className="pastForwardUploadText">
                Upload a photo and watch AI transform you through 6 different decades
              </p>
              <label htmlFor="file-upload" className="pastForwardUploadButton">
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  className="pastForwardUploadInput"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                />
                Choose Photo
              </label>
            </div>
          </div>
        )}

        {appState === 'image-uploaded' && uploadedImage && (
          <div className="pastForwardPreview">
            <div className="pastForwardPreviewCard">
              <img src={uploadedImage} alt="Your Photo" className="pastForwardPreviewImage" />
              <p className="pastForwardPreviewCaption">Your Photo</p>
            </div>
            <div className="pastForwardPreviewActions">
              <button onClick={handleReset} className="pastForwardButtonSecondary">
                Different Photo
              </button>
              <button onClick={handleGenerateClick} className="pastForwardButtonPrimary">
                Generate Decades
              </button>
            </div>
          </div>
        )}

        {(appState === 'generating' || appState === 'results-shown') && (
          <>
            {isMobile ? (
              <div className="pastForwardMobileGrid">
                {DECADES.map((decade, index) => (
                  <PolaroidCard
                    key={decade}
                    caption={decade}
                    status={generatedImages[decade]?.status || 'pending'}
                    imageUrl={generatedImages[decade]?.url}
                    error={generatedImages[decade]?.error}
                    onRegenerate={handleRegenerateDecade}
                    onDownload={handleDownloadImage}
                    isMobile={true}
                  />
                ))}
              </div>
            ) : (
              <div className="pastForwardDesktopGrid">
                {DECADES.map((decade, index) => (
                  <PolaroidCard
                    key={decade}
                    caption={decade}
                    status={generatedImages[decade]?.status || 'pending'}
                    imageUrl={generatedImages[decade]?.url}
                    error={generatedImages[decade]?.error}
                    position={POSITIONS[index]}
                    onRegenerate={handleRegenerateDecade}
                    onDownload={handleDownloadImage}
                    isMobile={false}
                  />
                ))}
              </div>
            )}

            {appState === 'results-shown' && (
              <div className="pastForwardResultsActions">
                {user && (
                  <button
                    onClick={saveAllToGallery}
                    disabled={isSaving}
                    className="pastForwardButtonPrimary"
                  >
                    {isSaving ? 'Saving...' : 'Save All to Gallery'}
                  </button>
                )}
                <button onClick={handleReset} className="pastForwardButtonSecondary">
                  Start Over
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
