/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DotsVerticalIcon } from './icons';

export const Compare = ({ firstImage = '', secondImage = '', className = '', initialSliderPercentage = 50, slideMode = 'hover' }) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const handleStart = useCallback((clientX) => {
    if (slideMode === 'drag') setIsDragging(true);
  }, [slideMode]);

  const handleEnd = useCallback(() => {
    if (slideMode === 'drag') setIsDragging(false);
  }, [slideMode]);

  const handleMove = useCallback((clientX) => {
    if (!sliderRef.current) return;
    if (slideMode === 'hover' || (slideMode === 'drag' && isDragging)) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = (x / rect.width) * 100;
      requestAnimationFrame(() => {
        setSliderXPercent(Math.max(0, Math.min(100, percent)));
      });
    }
  }, [slideMode, isDragging]);

  const clipValue = 100 - sliderXPercent;

  return (
    <div
      ref={sliderRef}
      className={className}
      style={{ position: 'relative', cursor: slideMode === 'drag' ? (isDragging ? 'grabbing' : 'grab') : 'col-resize', overflow: 'hidden' }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseUp={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <motion.div
        className="h-full w-px absolute top-0 m-auto z-30"
        style={{ left: `${sliderXPercent}%`, top: '0', zIndex: 40, background: 'linear-gradient(to bottom, transparent 5%, #667eea 50%, transparent 95%)' }}
        transition={{ duration: 0 }}
      >
        <div className="h-5 w-5 rounded-md bg-white z-30 absolute flex items-center justify-center" style={{ top: '50%', left: '-10px', transform: 'translateY(-50%)', border: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <DotsVerticalIcon className="h-4 w-4 text-black" />
        </div>
      </motion.div>
      <div className="overflow-hidden w-full h-full relative z-20 pointer-events-none">
        {firstImage && (
          <motion.div className="absolute inset-0 z-20 rounded-2xl shrink-0 w-full h-full select-none overflow-hidden" style={{ clipPath: `inset(0 ${clipValue}% 0 0)` }} transition={{ duration: 0 }}>
            <img alt="first image" src={firstImage} className="absolute inset-0 z-20 rounded-2xl shrink-0 w-full h-full select-none object-cover" draggable={false} />
          </motion.div>
        )}
      </div>
      {secondImage && (
        <motion.img className="absolute top-0 left-0 z-[19] rounded-2xl w-full h-full select-none object-cover" alt="second image" src={secondImage} draggable={false} />
      )}
    </div>
  );
};
