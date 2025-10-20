/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { UploadCloudIcon, CheckCircleIcon } from './icons';

const urlToFile = (url, filename) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context.'));
      }
      ctx.drawImage(image, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          return reject(new Error('Canvas toBlob failed.'));
        }
        const mimeType = blob.type || 'image/png';
        const file = new File([blob], filename, { type: mimeType });
        resolve(file);
      }, 'image/png');
    };

    image.onerror = (error) => {
      reject(new Error(`Could not load image from URL for canvas conversion. Error: ${error}`));
    };

    image.src = url;
  });
};

const WardrobePanel = ({ onGarmentSelect, activeGarmentIds, isLoading, wardrobe }) => {
  const [error, setError] = useState(null);

  const handleGarmentClick = async (item) => {
    if (isLoading || activeGarmentIds.includes(item.id)) return;
    setError(null);
    try {
      const file = await urlToFile(item.url, item.name);
      onGarmentSelect(file, item);
    } catch (err) {
      const detailedError = `Failed to load wardrobe item. This is often a CORS issue. Check the developer console for details.`;
      setError(detailedError);
      console.error(`[CORS Check] Failed to load and convert wardrobe item from URL: ${item.url}. The browser's console should have a specific CORS error message if that's the issue.`, err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
      const customGarmentInfo = {
        id: `custom-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
      };
      onGarmentSelect(file, customGarmentInfo);
    }
  };

  return (
    <div className="pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
      <h2 className="text-lg font-serif tracking-wider mb-3" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Wardrobe</h2>
      <div className="grid grid-cols-2 gap-3">
        {wardrobe.map((item) => {
          const isActive = activeGarmentIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleGarmentClick(item)}
              disabled={isLoading || isActive}
              className="relative aspect-square rounded-lg overflow-hidden transition-all duration-200 focus:outline-none group disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ border: '1px solid rgba(255, 255, 255, 0.15)' }}
              onMouseEnter={(e) => !isActive && !isLoading && (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)')}
              onMouseLeave={(e) => !isActive && !isLoading && (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
              aria-label={`Select ${item.name}`}
            >
              <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-bold text-center p-1">{item.name}</p>
              </div>
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
                  <CheckCircleIcon className="w-8 h-8 text-white" />
                </div>
              )}
            </button>
          );
        })}
        <label htmlFor="custom-garment-upload" className={`relative aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`} style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: 'rgba(255, 255, 255, 0.5)' }} onMouseEnter={(e) => !isLoading && (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)')} onMouseLeave={(e) => !isLoading && (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)')}>
          <UploadCloudIcon className="w-6 h-6 mb-1"/>
          <span className="text-xs text-center">Upload</span>
          <input id="custom-garment-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} disabled={isLoading}/>
        </label>
      </div>
      {wardrobe.length === 0 && (
        <p className="text-center text-sm mt-4" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Your uploaded garments will appear here.</p>
      )}
      {error && <p className="text-sm mt-4" style={{ color: '#ff6b6b' }}>{error}</p>}
    </div>
  );
};

export default WardrobePanel;
