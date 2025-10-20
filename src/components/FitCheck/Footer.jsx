/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REMIX_SUGGESTIONS = [
  "Try different clothing combinations",
  "Experiment with various poses",
  "Upload your own wardrobe items",
  "Layer multiple garments for unique looks",
  "Save your favorite outfits",
  "Share your style transformations"
];

const Footer = ({ isOnDressingScreen = false }) => {
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prevIndex) => (prevIndex + 1) % REMIX_SUGGESTIONS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={`fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10 p-3 z-50 ${isOnDressingScreen ? 'hidden sm:block' : ''}`}>
      <div className="mx-auto flex flex-col sm:flex-row items-center justify-between text-xs max-w-7xl px-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        <p>
          Virtual Try-On powered by{' '}
          <a 
            href="https://ai.google.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
            style={{ color: 'rgba(255, 255, 255, 0.9)' }}
          >
            Gemini AI
          </a>
        </p>
        <div className="h-4 mt-1 sm:mt-0 flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={suggestionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="text-center sm:text-right"
            >
              {REMIX_SUGGESTIONS[suggestionIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
