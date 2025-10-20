/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Trash2Icon } from './icons';

const OutfitStack = ({ outfitHistory, onRemoveLastGarment }) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-serif tracking-wider border-b pb-2 mb-3" style={{ color: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>Outfit Stack</h2>
      <div className="space-y-2">
        {outfitHistory.map((layer, index) => (
          <div
            key={layer.garment?.id || 'base'}
            className="flex items-center justify-between p-2 rounded-lg animate-fade-in"
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <div className="flex items-center overflow-hidden">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 mr-3 text-xs font-bold rounded-full" style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'rgba(255, 255, 255, 0.9)' }}>
                {index + 1}
              </span>
              {layer.garment && (
                <img src={layer.garment.url} alt={layer.garment.name} className="flex-shrink-0 w-12 h-12 object-cover rounded-md mr-3" />
              )}
              <span className="font-semibold truncate" style={{ color: 'rgba(255, 255, 255, 0.9)' }} title={layer.garment?.name}>
                {layer.garment ? layer.garment.name : 'Base Model'}
              </span>
            </div>
            {index > 0 && index === outfitHistory.length - 1 && (
              <button
                onClick={onRemoveLastGarment}
                className="flex-shrink-0 transition-colors p-2 rounded-md"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'; e.currentTarget.style.background = 'transparent'; }}
                aria-label={`Remove ${layer.garment?.name}`}
              >
                <Trash2Icon className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        {outfitHistory.length === 1 && (
          <p className="text-center text-sm pt-4" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Your stacked items will appear here. Select an item from the wardrobe below.</p>
        )}
      </div>
    </div>
  );
};

export default OutfitStack;
