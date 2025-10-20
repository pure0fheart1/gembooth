/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { RotateCcwIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import Spinner from './Spinner';
import { AnimatePresence, motion } from 'framer-motion';

// Download icon SVG
const DownloadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const Canvas = ({ displayImageUrl, onStartOver, isLoading, loadingMessage, onSelectPose, poseInstructions, currentPoseIndex, availablePoseKeys }) => {
  const [isPoseMenuOpen, setIsPoseMenuOpen] = useState(false);

  const handleDownload = () => {
    if (!displayImageUrl) return;
    const link = document.createElement('a');
    link.href = displayImageUrl;
    link.download = `fit-check-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviousPose = () => {
    if (isLoading || availablePoseKeys.length <= 1) return;
    const currentPoseInstruction = poseInstructions[currentPoseIndex];
    const currentIndexInAvailable = availablePoseKeys.indexOf(currentPoseInstruction);
    if (currentIndexInAvailable === -1) {
      onSelectPose((currentPoseIndex - 1 + poseInstructions.length) % poseInstructions.length);
      return;
    }
    const prevIndexInAvailable = (currentIndexInAvailable - 1 + availablePoseKeys.length) % availablePoseKeys.length;
    const prevPoseInstruction = availablePoseKeys[prevIndexInAvailable];
    const newGlobalPoseIndex = poseInstructions.indexOf(prevPoseInstruction);
    if (newGlobalPoseIndex !== -1) {
      onSelectPose(newGlobalPoseIndex);
    }
  };

  const handleNextPose = () => {
    if (isLoading) return;
    const currentPoseInstruction = poseInstructions[currentPoseIndex];
    const currentIndexInAvailable = availablePoseKeys.indexOf(currentPoseInstruction);
    if (currentIndexInAvailable === -1 || availablePoseKeys.length === 0) {
      onSelectPose((currentPoseIndex + 1) % poseInstructions.length);
      return;
    }
    const nextIndexInAvailable = currentIndexInAvailable + 1;
    if (nextIndexInAvailable < availablePoseKeys.length) {
      const nextPoseInstruction = availablePoseKeys[nextIndexInAvailable];
      const newGlobalPoseIndex = poseInstructions.indexOf(nextPoseInstruction);
      if (newGlobalPoseIndex !== -1) {
        onSelectPose(newGlobalPoseIndex);
      }
    } else {
      const newGlobalPoseIndex = (currentPoseIndex + 1) % poseInstructions.length;
      onSelectPose(newGlobalPoseIndex);
    }
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 relative animate-zoom-in group">
      <button
        onClick={onStartOver}
        className="absolute top-4 left-4 z-30 flex items-center justify-center text-center font-semibold py-2 px-4 rounded-full transition-all duration-200 ease-in-out active:scale-95 text-sm backdrop-blur-sm"
        style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff' }}
      >
        <RotateCcwIcon className="w-4 h-4 mr-2" />
        Start Over
      </button>

      {displayImageUrl && !isLoading && (
        <div className="absolute top-4 right-4 z-30 flex gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center p-2 rounded-full transition-all duration-200 ease-in-out active:scale-95 backdrop-blur-sm hover:scale-110"
            style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff' }}
            aria-label="Download image"
            title="Download image"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
        {displayImageUrl ? (
          <img key={displayImageUrl} src={displayImageUrl} alt="Virtual try-on model" className="w-full h-auto max-h-full object-contain transition-opacity duration-500 animate-fade-in rounded-lg shadow-2xl" />
        ) : (
          <div className="w-[400px] h-[600px] rounded-lg flex flex-col items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Spinner />
            <p className="text-md font-serif mt-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading Model...</p>
          </div>
        )}
        <AnimatePresence>
          {isLoading && (
            <motion.div className="absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.8)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Spinner />
              {loadingMessage && <p className="text-lg font-serif mt-4 text-center px-4" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{loadingMessage}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {displayImageUrl && !isLoading && (
        <div className="absolute bottom-6 left-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transform: 'translateX(-50%)' }} onMouseEnter={() => setIsPoseMenuOpen(true)} onMouseLeave={() => setIsPoseMenuOpen(false)}>
          <AnimatePresence>
            {isPoseMenuOpen && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute w-64 backdrop-blur-lg rounded-xl p-2" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', bottom: '100%', marginBottom: '12px' }}>
                <div className="grid grid-cols-2 gap-2">
                  {poseInstructions.map((pose, index) => (
                    <button key={pose} onClick={() => onSelectPose(index)} disabled={isLoading || index === currentPoseIndex} className="w-full text-left text-sm font-medium p-2 rounded-md disabled:opacity-50 disabled:font-bold disabled:cursor-not-allowed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {pose}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-center gap-2 backdrop-blur-md rounded-full p-2" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <button onClick={handlePreviousPose} aria-label="Previous pose" className="p-2 rounded-full active:scale-90 transition-all disabled:opacity-50" style={{ color: 'rgba(255, 255, 255, 0.9)' }} disabled={isLoading}>
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold w-48 text-center truncate" style={{ color: 'rgba(255, 255, 255, 0.9)' }} title={poseInstructions[currentPoseIndex]}>
              {poseInstructions[currentPoseIndex]}
            </span>
            <button onClick={handleNextPose} aria-label="Next pose" className="p-2 rounded-full active:scale-90 transition-all disabled:opacity-50" style={{ color: 'rgba(255, 255, 255, 0.9)' }} disabled={isLoading}>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
