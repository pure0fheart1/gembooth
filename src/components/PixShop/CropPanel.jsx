/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import '../../styles/PixShop.css';

const CropPanel = ({ onApplyCrop, onSetAspect, isLoading, isCropping }) => {
  const aspectOptions = [
    { name: 'Free', value: undefined },
    { name: '1:1', value: 1 },
    { name: '16:9', value: 16 / 9 },
    { name: '4:3', value: 4 / 3 },
    { name: '3:2', value: 3 / 2 },
  ];

  return (
    <div className="pixshopPanel">
      <h3 className="pixshopPanelTitle">Crop Image</h3>
      <p className="pixshopRetouchHint" style={{ marginBottom: '1rem' }}>
        Drag on the image to select the area you want to keep.
      </p>

      <div className="pixshopCropControls">
        {aspectOptions.map(option => (
          <button
            key={option.name}
            onClick={() => onSetAspect(option.value)}
            disabled={isLoading}
            className="pixshopCropAspectButton"
          >
            {option.name}
          </button>
        ))}
      </div>

      {isCropping && (
        <button
          onClick={onApplyCrop}
          className="pixshopApplyButton"
          disabled={isLoading}
        >
          Apply Crop
        </button>
      )}
    </div>
  );
};

export default CropPanel;
