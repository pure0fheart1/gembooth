/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect, useRef } from 'react'

export default function CameraSettings({
  isOpen,
  onClose,
  facingMode,
  onFacingModeChange,
  timerDuration,
  onTimerChange,
  burstMode,
  onBurstModeChange
}) {
  const modalRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="cameraSettingsOverlay">
      <div className="cameraSettingsModal" ref={modalRef}>
        <div className="cameraSettingsHeader">
          <h2>Camera Settings</h2>
          <button className="circleBtn" onClick={onClose} aria-label="Close settings">
            <span className="icon">close</span>
          </button>
        </div>

        <div className="cameraSettingsContent">
          {/* Camera Selection */}
          <div className="settingSection">
            <h3>
              <span className="icon">videocam</span>
              Camera
            </h3>
            <div className="settingOptions">
              <button
                className={`settingOption ${facingMode === 'user' ? 'active' : ''}`}
                onClick={() => onFacingModeChange('user')}
              >
                <span className="icon">person</span>
                <div>
                  <p className="optionLabel">Front Camera</p>
                  <p className="optionDesc">Selfie mode</p>
                </div>
              </button>
              <button
                className={`settingOption ${facingMode === 'environment' ? 'active' : ''}`}
                onClick={() => onFacingModeChange('environment')}
              >
                <span className="icon">camera_rear</span>
                <div>
                  <p className="optionLabel">Back Camera</p>
                  <p className="optionDesc">Rear-facing</p>
                </div>
              </button>
            </div>
          </div>

          {/* Timer Selection */}
          <div className="settingSection">
            <h3>
              <span className="icon">timer</span>
              Timer
            </h3>
            <div className="settingOptions timerGrid">
              <button
                className={`settingOption ${timerDuration === 0 ? 'active' : ''}`}
                onClick={() => onTimerChange(0)}
              >
                <span className="timerLabel">Off</span>
                <p className="optionDesc">Instant</p>
              </button>
              <button
                className={`settingOption ${timerDuration === 3 ? 'active' : ''}`}
                onClick={() => onTimerChange(3)}
              >
                <span className="timerLabel">3s</span>
                <p className="optionDesc">3 seconds</p>
              </button>
              <button
                className={`settingOption ${timerDuration === 5 ? 'active' : ''}`}
                onClick={() => onTimerChange(5)}
              >
                <span className="timerLabel">5s</span>
                <p className="optionDesc">5 seconds</p>
              </button>
              <button
                className={`settingOption ${timerDuration === 10 ? 'active' : ''}`}
                onClick={() => onTimerChange(10)}
              >
                <span className="timerLabel">10s</span>
                <p className="optionDesc">10 seconds</p>
              </button>
            </div>
          </div>

          {/* Burst Mode */}
          <div className="settingSection">
            <h3>
              <span className="icon">burst_mode</span>
              Burst Mode
            </h3>
            <div className="settingOptions">
              <button
                className={`settingOption ${!burstMode ? 'active' : ''}`}
                onClick={() => onBurstModeChange(false)}
              >
                <span className="icon">photo_camera</span>
                <div>
                  <p className="optionLabel">Single Photo</p>
                  <p className="optionDesc">Take one photo</p>
                </div>
              </button>
              <button
                className={`settingOption ${burstMode ? 'active' : ''}`}
                onClick={() => onBurstModeChange(true)}
              >
                <span className="icon">burst_mode</span>
                <div>
                  <p className="optionLabel">Burst Mode</p>
                  <p className="optionDesc">5 photos, 2.5s apart</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
