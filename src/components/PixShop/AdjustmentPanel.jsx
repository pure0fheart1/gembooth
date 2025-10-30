/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import '../../styles/PixShop.css';

const AdjustmentPanel = ({ onApplyAdjustment, isLoading }) => {
  const [selectedPresetPrompt, setSelectedPresetPrompt] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const presets = [
    { name: 'Brighten', prompt: 'Increase the overall brightness of the image, making it lighter and more vibrant.' },
    { name: 'Darken', prompt: 'Decrease the overall brightness of the image, making it darker and moodier.' },
    { name: 'Blur BG', prompt: 'Apply a smooth blur to the background while keeping the main subject in sharp focus.' },
    { name: 'Sharpen', prompt: 'Sharpen the entire image, enhancing details and edges for a crisper look.' },
  ];

  const activePrompt = selectedPresetPrompt || customPrompt;

  const handlePresetClick = (prompt) => {
    setSelectedPresetPrompt(prompt);
    setCustomPrompt('');
  };

  const handleCustomChange = (e) => {
    setCustomPrompt(e.target.value);
    setSelectedPresetPrompt(null);
  };

  const handleApply = () => {
    if (activePrompt) {
      onApplyAdjustment(activePrompt);
    }
  };

  return (
    <div className="pixshopPanel">
      <h3 className="pixshopPanelTitle">Apply an Adjustment</h3>

      <div className="pixshopPresetGrid">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset.prompt)}
            disabled={isLoading}
            className={`pixshopPresetButton ${selectedPresetPrompt === preset.prompt ? 'selected' : ''}`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={customPrompt}
        onChange={handleCustomChange}
        placeholder="Or describe a custom adjustment (e.g., 'add warmth')"
        className="pixshopCustomInput"
        disabled={isLoading}
      />

      {activePrompt && (
        <div>
          <button
            onClick={handleApply}
            className="pixshopApplyButton"
            disabled={isLoading || !activePrompt.trim()}
          >
            Apply Adjustment
          </button>
        </div>
      )}
    </div>
  );
};

export default AdjustmentPanel;
