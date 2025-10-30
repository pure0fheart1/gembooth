import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LoaderCircle, SendHorizontal, Trash2, X, Save, Download } from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase/client';
import { checkUsageLimit, incrementUsage } from '../lib/usageTracking';
import '../styles/CoDrawing.css';

// Initialize Gemini AI with the hardcoded API key
const ai = new GoogleGenAI({ apiKey: 'AIzaSyBjosltDAxf1XQXoxO7ogY6BXO3UmD191A' });

const MODELS = [
  { id: 'gemini-2.5-flash-image', name: '2.5 Flash' },
  { id: 'gemini-2.0-flash-preview-image-generation', name: '2.0 Flash' }
];

export default function CoDrawing() {
  const canvasRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const colorInputRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#000000');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash-image');
  const [isSaving, setIsSaving] = useState(false);

  const { user } = useAuth();

  // Load background image when generatedImage changes
  useEffect(() => {
    if (generatedImage && canvasRef.current) {
      const img = new window.Image();
      img.onload = () => {
        backgroundImageRef.current = img;
        drawImageToCanvas();
      };
      img.src = generatedImage;
    }
  }, [generatedImage]);

  // Initialize canvas with white background when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas();
    }
  }, []);

  // Initialize canvas with white background
  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Draw the background image to the canvas
  const drawImageToCanvas = () => {
    if (!canvasRef.current || !backgroundImageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Fill with white background first
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the background image
    ctx.drawImage(
      backgroundImageRef.current,
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  // Get the correct coordinates based on canvas scaling
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.nativeEvent.offsetX || e.nativeEvent.touches?.[0]?.clientX - rect.left) * scaleX,
      y: (e.nativeEvent.offsetY || e.nativeEvent.touches?.[0]?.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    if (e.type === 'touchstart') {
      e.preventDefault();
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    if (e.type === 'touchmove') {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setGeneratedImage(null);
    backgroundImageRef.current = null;
  };

  const handleColorChange = (e) => {
    setPenColor(e.target.value);
  };

  const openColorPicker = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canvasRef.current) return;

    // Check if user is logged in
    if (!user) {
      setErrorMessage('Please log in to use Co-Drawing');
      setShowErrorModal(true);
      return;
    }

    // Check usage limit before proceeding
    const usageCheck = await checkUsageLimit(user.id, 'codrawing');
    if (!usageCheck.allowed) {
      setErrorMessage(usageCheck.message || 'You have reached your Co-Drawing limit for this month. Please upgrade your plan to continue.');
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const canvas = canvasRef.current;

      // Create a temporary canvas to add white background
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');

      // Fill with white background
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the original canvas content on top
      tempCtx.drawImage(canvas, 0, 0);

      const drawingData = tempCanvas.toDataURL('image/png').split(',')[1];

      let contents = [
        {
          role: 'USER',
          parts: [{ text: prompt }],
        },
      ];

      if (drawingData) {
        contents = [
          {
            role: 'USER',
            parts: [{ inlineData: { data: drawingData, mimeType: 'image/png' } }],
          },
          {
            role: 'USER',
            parts: [{ text: `${prompt}. Keep the same minimal line drawing style.` }],
          },
        ];
      }

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      const data = {
        success: true,
        message: '',
        imageData: null,
        error: undefined,
      };

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          data.message = part.text;
        } else if (part.inlineData) {
          data.imageData = part.inlineData.data;
        }
      }

      if (data.success && data.imageData) {
        const imageUrl = `data:image/png;base64,${data.imageData}`;
        setGeneratedImage(imageUrl);

        // Increment usage after successful generation
        await incrementUsage(user.id, 'codrawing');
      } else {
        throw new Error('Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting drawing:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToGallery = async () => {
    if (!generatedImage || !user) {
      alert('Please log in to save your drawings to the gallery.');
      return;
    }

    setIsSaving(true);

    try {
      // Convert base64 to blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();

      const drawingId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const filePath = `${user.id}/codrawings/${drawingId}.png`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(filePath, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-photos')
        .getPublicUrl(filePath);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('codrawings')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          prompt: prompt,
        });

      if (dbError) throw dbError;

      alert('Drawing saved to your gallery!');
    } catch (error) {
      console.error('Error saving drawing:', error);
      alert('Failed to save drawing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `codrawing-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  // Add touch event prevention
  useEffect(() => {
    const preventTouchDefault = (e) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', preventTouchDefault, { passive: false });
      canvas.addEventListener('touchmove', preventTouchDefault, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('touchstart', preventTouchDefault);
        canvas.removeEventListener('touchmove', preventTouchDefault);
      }
    };
  }, [isDrawing]);

  return (
    <div className="coDrawingPage">
      <header className="coDrawingHeader">
        <div>
          <h1 className="coDrawingTitle">
            <span className="coDrawingTitleGradient">Co-Drawing Studio</span>
          </h1>
          <p className="coDrawingSubtitle">Draw something and let AI bring it to life</p>
        </div>
      </header>

      <main className="coDrawingMain">
        <div className="coDrawingContainer">
          {/* Toolbar */}
          <div className="coDrawingToolbar">
            <div className="coDrawingToolbarLeft">
              <div className="coDrawingModelSelect">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="coDrawingSelect"
                >
                  {MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="coDrawingSelectIcon" />
              </div>
            </div>

            <div className="coDrawingToolbarRight">
              <button
                type="button"
                className="coDrawingColorButton"
                onClick={openColorPicker}
                style={{ backgroundColor: penColor }}
              >
                <input
                  ref={colorInputRef}
                  type="color"
                  value={penColor}
                  onChange={handleColorChange}
                  className="coDrawingColorInput"
                />
              </button>
              <button
                type="button"
                onClick={clearCanvas}
                className="coDrawingToolButton"
              >
                <Trash2 className="coDrawingToolIcon" />
              </button>
              {generatedImage && (
                <>
                  <button
                    type="button"
                    onClick={downloadImage}
                    className="coDrawingToolButton"
                  >
                    <Download className="coDrawingToolIcon" />
                  </button>
                  {user && (
                    <button
                      type="button"
                      onClick={saveToGallery}
                      disabled={isSaving}
                      className="coDrawingToolButton"
                    >
                      <Save className="coDrawingToolIcon" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="coDrawingCanvasContainer">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="coDrawingCanvas"
            />
          </div>

          {/* Prompt Input */}
          <form onSubmit={handleSubmit} className="coDrawingForm">
            <div className="coDrawingInputContainer">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want AI to enhance your drawing..."
                className="coDrawingInput"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="coDrawingSubmitButton"
              >
                {isLoading ? (
                  <LoaderCircle className="coDrawingLoadingIcon" />
                ) : (
                  <SendHorizontal className="coDrawingSubmitIcon" />
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="coDrawingModal">
          <div className="coDrawingModalContent">
            <div className="coDrawingModalHeader">
              <h3 className="coDrawingModalTitle">Failed to generate</h3>
              <button onClick={closeErrorModal} className="coDrawingModalClose">
                <X className="coDrawingModalCloseIcon" />
              </button>
            </div>
            <p className="coDrawingModalMessage">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
