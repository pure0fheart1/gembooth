/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react'

/**
 * EmptyState Component - Handles various empty states in the photo booth
 *
 * Provides engaging, informative empty states with animations and helpful guidance
 * for different scenarios: initial welcome, processing, errors, and no mode selected.
 *
 * @param {Object} props
 * @param {string} props.type - Type of empty state: 'initial', 'processing', 'error', 'no-mode'
 * @param {string} props.errorMessage - Custom error message for error state
 * @param {Function} props.onRetry - Callback for retry action in error state
 */
export default function EmptyState({ type = 'initial', errorMessage = null, onRetry = null }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [animate, setAnimate] = useState(true)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Only animate steps for initial state
    if (type !== 'initial') return

    // Initial animation on mount
    if (!hasAnimated) {
      setHasAnimated(true)
      setTimeout(() => setAnimate(false), 500)
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev === 3 ? 1 : prev + 1))
      setAnimate(true)
      setTimeout(() => setAnimate(false), 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [type, hasAnimated])

  // Error State
  if (type === 'error') {
    return (
      <li className="emptyState error" key="empty-error">
        <div className="emptyStateContent">
          <div className="errorIcon" role="img" aria-label="Error">
            <span className="icon">error</span>
          </div>
          <h3>Oops! Something went wrong</h3>
          <p className="errorMessage">
            {errorMessage || 'Unable to process your photo. Please try again.'}
          </p>
          {onRetry && (
            <button
              className="button retryButton"
              onClick={onRetry}
              aria-label="Retry processing photo"
            >
              <span className="icon">refresh</span>
              Try Again
            </button>
          )}
          <div className="errorTips">
            <p className="tipTitle">Common issues:</p>
            <ul>
              <li>Check your internet connection</li>
              <li>Make sure your face is clearly visible</li>
              <li>Try a different lighting condition</li>
            </ul>
          </div>
        </div>
      </li>
    )
  }

  // Processing State
  if (type === 'processing') {
    return (
      <li className="emptyState processing" key="empty-processing">
        <div className="emptyStateContent">
          <div className="processingAnimation" role="status" aria-live="polite">
            <div className="spinnerRing"></div>
            <span className="icon processingIcon">auto_awesome</span>
          </div>
          <h3>Creating your masterpiece...</h3>
          <p>AI is transforming your photo. This usually takes 3-5 seconds.</p>
          <div className="processingSteps">
            <div className="processingStep">
              <span className="stepCheck">✓</span>
              <span>Photo uploaded</span>
            </div>
            <div className="processingStep active">
              <span className="stepDot"></span>
              <span>AI processing</span>
            </div>
            <div className="processingStep">
              <span className="stepDot"></span>
              <span>Finalizing</span>
            </div>
          </div>
        </div>
      </li>
    )
  }

  // No Mode Selected State
  if (type === 'no-mode') {
    return (
      <li className="emptyState no-mode" key="empty-no-mode">
        <div className="emptyStateContent">
          <div className="noModeIcon" role="img" aria-label="Select a mode">
            <span className="icon">palette</span>
          </div>
          <h3>Choose Your Effect First</h3>
          <p>Select an AI transformation mode from the menu below before taking a photo.</p>
          <div className="modeExamples">
            <div className="exampleMode">
              <span className="modeEmoji">🎨</span>
              <span className="modeName">Renaissance</span>
            </div>
            <div className="exampleMode">
              <span className="modeEmoji">😃</span>
              <span className="modeName">Cartoon</span>
            </div>
            <div className="exampleMode">
              <span className="modeEmoji">🍣</span>
              <span className="modeName">Anime</span>
            </div>
          </div>
          <div className="pointerDown">
            <span className="icon">arrow_downward</span>
            <p>Pick one below</p>
          </div>
        </div>
      </li>
    )
  }

  // Initial/Welcome State (default) - Minimal version
  return (
    <li className="emptyState initial minimal" key="empty-initial" role="status" aria-live="polite">
      <div className="emptyStateContent">
        <div className="emptyStateHeader">
          <div className="welcomeIcon" role="img" aria-label="Camera icon">
            <span className="icon" aria-hidden="true">photo_camera</span>
          </div>
          <h3>Ready to Transform</h3>
          <p className="subtitle">Choose a style below and snap a photo!</p>
        </div>

        <div className="emptyStateTips compact" role="complementary" aria-label="Quick tips">
          <div className="tip">
            <span className="tipIcon" aria-hidden="true">🎨</span>
            <p>Pick a style</p>
          </div>
          <div className="tip">
            <span className="tipIcon" aria-hidden="true">📸</span>
            <p>Take photo</p>
          </div>
          <div className="tip">
            <span className="tipIcon" aria-hidden="true">✨</span>
            <p>Watch magic</p>
          </div>
        </div>
      </div>
    </li>
  )
}
