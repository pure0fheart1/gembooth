/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloudIcon } from './icons';
import { Compare } from './Compare';
import { generateModelImage } from '../../lib/fitCheck/fitCheckService';
import Spinner from './Spinner';
import { getFriendlyErrorMessage } from '../../lib/fitCheck/utils';

const StartScreen = ({ onModelFinalized }) => {
  const [userImageUrl, setUserImageUrl] = useState(null);
  const [generatedModelUrl, setGeneratedModelUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = useCallback(async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      setUserImageUrl(dataUrl);
      setIsGenerating(true);
      setGeneratedModelUrl(null);
      setError(null);
      try {
        const result = await generateModelImage(file);
        setGeneratedModelUrl(result);
      } catch (err) {
        setError(getFriendlyErrorMessage(err, 'Failed to create model'));
        setUserImageUrl(null);
      } finally {
        setIsGenerating(false);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const reset = () => {
    setUserImageUrl(null);
    setGeneratedModelUrl(null);
    setIsGenerating(false);
    setError(null);
  };

  const screenVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <AnimatePresence mode="wait">
      {!userImageUrl ? (
        <motion.div
          key="uploader"
          className="fitCheckStartScreen"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Left: Text & Upload */}
          <div className="fitCheckStartLeft">
            <div className="fitCheckStartContent">
              <div className="fitCheckStartBadge">
                ✨ AI-Powered Virtual Try-On
              </div>
              <h2 className="fitCheckStartHeading">
                See Yourself in Any Outfit
              </h2>
              <p className="fitCheckStartDescription">
                Upload a photo and watch as AI transforms you into a fashion model. Try on clothes, experiment with styles, and discover your perfect look.
              </p>

              <div className="fitCheckStartDivider"></div>

              <div className="fitCheckStartUploadSection">
                <label htmlFor="image-upload-start" className="fitCheckUploadButton">
                  <UploadCloudIcon className="w-5 h-5" />
                  <span>Upload Your Photo</span>
                </label>
                <input
                  id="image-upload-start"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif"
                  onChange={handleFileChange}
                />

                <div className="fitCheckStartHints">
                  <p className="fitCheckStartHint">
                    📸 Clear, full-body photos work best
                  </p>
                  <p className="fitCheckStartHint">
                    😊 Face-only photos also supported
                  </p>
                </div>

                <p className="fitCheckStartDisclaimer">
                  By uploading, you agree to use this service responsibly and ethically.
                </p>

                {error && (
                  <div className="fitCheckStartError">
                    <span className="fitCheckStartErrorIcon">⚠️</span>
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Demo Compare */}
          <div className="fitCheckStartRight">
            <div className="fitCheckStartDemo">
              <Compare
                firstImage="https://storage.googleapis.com/gemini-95-icons/asr-tryon.jpg"
                secondImage="https://storage.googleapis.com/gemini-95-icons/asr-tryon-model.png"
                slideMode="drag"
                className="fitCheckCompareImage"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
              />
              <p className="fitCheckStartDemoCaption">
                Drag to see the transformation
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="compare"
          className="w-full max-w-6xl mx-auto h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="md:w-1/2 flex-shrink-0 flex flex-col items-center md:items-start">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight" style={{ color: '#fff' }}>
                The New You
              </h1>
              <p className="mt-2 text-md" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Drag the slider to see your transformation.
              </p>
            </div>

            {isGenerating && (
              <div className="flex items-center gap-3 text-lg font-serif mt-6" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <Spinner />
                <span>Generating your model...</span>
              </div>
            )}

            {error &&
              <div className="text-center md:text-left max-w-md mt-6" style={{ color: '#ff6b6b' }}>
                <p className="font-semibold">Generation Failed</p>
                <p className="text-sm mb-4">{error}</p>
                <button onClick={reset} className="text-sm font-semibold hover:underline" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Try Again</button>
              </div>
            }

            <AnimatePresence>
              {generatedModelUrl && !isGenerating && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-4 mt-8"
                >
                  <button
                    onClick={reset}
                    className="w-full sm:w-auto px-6 py-3 text-base font-semibold rounded-md cursor-pointer transition-colors"
                    style={{ color: 'rgba(255, 255, 255, 0.9)', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                  >
                    Use Different Photo
                  </button>
                  <button
                    onClick={() => onModelFinalized(generatedModelUrl)}
                    className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white rounded-md cursor-pointer group transition-colors"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    Proceed to Styling �
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="md:w-1/2 w-full flex items-center justify-center">
            <div
              className={`relative rounded-[1.25rem] transition-all duration-700 ease-in-out ${isGenerating ? 'animate-pulse' : ''}`}
              style={{ border: isGenerating ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent' }}
            >
              <Compare
                firstImage={userImageUrl}
                secondImage={generatedModelUrl ?? userImageUrl}
                slideMode="drag"
                className="w-[280px] h-[420px] sm:w-[320px] sm:h-[480px] lg:w-[400px] lg:h-[600px] rounded-2xl"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartScreen;
