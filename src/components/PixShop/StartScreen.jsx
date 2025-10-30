/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { UploadIcon, MagicWandIcon, PaletteIcon, SunIcon } from './icons';
import '../../styles/PixShop.css';

const StartScreen = ({ onFileSelect }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFileChange = (e) => {
    onFileSelect(e.target.files);
  };

  return (
    <div
      className={`pixshopStartScreen ${isDraggingOver ? 'dragging' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        onFileSelect(e.dataTransfer.files);
      }}
    >
      <div className="pixshopStartContent">
        <h1 className="pixshopStartTitle">
          AI-Powered Photo Editing, <span className="pixshopStartTitleAccent">Simplified</span>.
        </h1>
        <p className="pixshopStartDescription">
          Retouch photos, apply creative filters, or make professional adjustments using simple text prompts. No complex tools needed.
        </p>

        <div className="pixshopStartUploadArea">
          <label htmlFor="image-upload-start" className="pixshopUploadButton">
            <UploadIcon className="pixshopUploadIcon" />
            Upload an Image
          </label>
          <input id="image-upload-start" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          <p className="pixshopStartHint">or drag and drop a file</p>
        </div>

        <div className="pixshopStartFeatures">
          <div className="pixshopFeatureCard">
            <div className="pixshopFeatureIcon">
              <MagicWandIcon />
            </div>
            <h3 className="pixshopFeatureTitle">Precise Retouching</h3>
            <p className="pixshopFeatureDescription">
              Click any point on your image to remove blemishes, change colors, or add elements with pinpoint accuracy.
            </p>
          </div>
          <div className="pixshopFeatureCard">
            <div className="pixshopFeatureIcon">
              <PaletteIcon />
            </div>
            <h3 className="pixshopFeatureTitle">Creative Filters</h3>
            <p className="pixshopFeatureDescription">
              Transform photos with artistic styles. From vintage looks to futuristic glows, find or create the perfect filter.
            </p>
          </div>
          <div className="pixshopFeatureCard">
            <div className="pixshopFeatureIcon">
              <SunIcon />
            </div>
            <h3 className="pixshopFeatureTitle">Pro Adjustments</h3>
            <p className="pixshopFeatureDescription">
              Enhance lighting, blur backgrounds, or change the mood. Get studio-quality results without complex tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
