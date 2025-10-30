/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import '../../styles/PixShop.css';

const FilterPanel = ({ onApplyFilter, isLoading }) => {
  const [selectedPresetPrompt, setSelectedPresetPrompt] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const presets = [
    { name: 'Synthwave', prompt: 'Apply a vibrant 80s synthwave aesthetic with neon magenta and cyan glows, and subtle scan lines.' },
    { name: 'Anime', prompt: 'Give the image a vibrant Japanese anime style, with bold outlines, cel-shading, and saturated colors.' },
    { name: 'Lomo', prompt: 'Apply a Lomography-style cross-processing film effect with high-contrast, oversaturated colors, and dark vignetting.' },
    { name: 'Glitch', prompt: 'Transform the image into a futuristic holographic projection with digital glitch effects and chromatic aberration.' },
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
      onApplyFilter(activePrompt);
    }
  };

  return (
    <div className="pixshopPanel">
      <h3 className="pixshopPanelTitle">Apply a Filter</h3>

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
        placeholder="Or describe a custom filter (e.g., '80s synthwave glow')"
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
            Apply Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
