/**
 * FitCheck Module - Virtual Try-On Feature
 *
 * Main entry point for the FitCheck virtual try-on functionality.
 * Re-exports all services and utilities for convenient imports.
 *
 * @example
 * import { generateModelImage, defaultWardrobe, getFriendlyErrorMessage } from '@/lib/fitCheck';
 */

// Service functions
export {
  generateModelImage,
  generateVirtualTryOnImage,
  generatePoseVariation,
} from './fitCheckService.js';

// Wardrobe data
export { defaultWardrobe } from './wardrobeData.js';

// Utility functions
export {
  getFriendlyErrorMessage,
  fileToDataUrl,
  urlToFile,
  isImageFile,
  formatFileSize,
} from './utils.js';
