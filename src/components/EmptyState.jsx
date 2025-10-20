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

  // Initial/Welcome State (default)
  return (
    <li className="emptyState initial" key="empty-initial" role="status" aria-live="polite">
      <div className="emptyStateContent">
        <div className="emptyStateHeader">
          <div className="welcomeIcon" role="img" aria-label="Camera icon">
            <span className="icon" aria-hidden="true">photo_camera</span>
          </div>
          <h3>Get Started in 3 Easy Steps</h3>
          <p className="subtitle">Transform yourself with AI magic</p>
        </div>

        <div className="emptyStateSteps">
          <div
            className={`emptyStep ${currentStep === 1 ? 'active' : 'completed'}`}
            role="listitem"
            aria-label="Step 1: Choose an effect"
          >
            <div className="stepNumber" aria-hidden="true">1</div>
            <div className="stepContent">
              <div className="stepIcon" aria-hidden="true">🎨</div>
              <h4>Choose an Effect</h4>
              <p>Pick from Renaissance, Cartoon, Anime, and more!</p>
            </div>
          </div>

          <div className="stepArrow" aria-hidden="true">
            <span className="icon">arrow_forward</span>
          </div>

          <div
            className={`emptyStep ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}
            role="listitem"
            aria-label="Step 2: Strike a pose"
          >
            <div className="stepNumber" aria-hidden="true">2</div>
            <div className="stepContent">
              <div className="stepIcon" aria-hidden="true">😊</div>
              <h4>Strike a Pose</h4>
              <p>Look at the camera and get ready to smile</p>
            </div>
          </div>

          <div className="stepArrow" aria-hidden="true">
            <span className="icon">arrow_forward</span>
          </div>

          <div
            className={`emptyStep ${currentStep === 3 ? 'active' : ''}`}
            role="listitem"
            aria-label="Step 3: Snap and transform"
          >
            <div className="stepNumber" aria-hidden="true">3</div>
            <div className="stepContent">
              <div className="stepIcon" aria-hidden="true">📸</div>
              <h4>Snap & Transform</h4>
              <p>Click the camera button and watch the magic!</p>
            </div>
          </div>
        </div>

        <div className="emptyStatePointer">
          <div className={`pointerAnimation ${animate ? 'pulse' : ''}`} role="img" aria-label="Click camera button below">
            <span className="icon pointingHand">touch_app</span>
            <p className="pointerText">Click the camera button below</p>
            <svg
              className="pointerArrow"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
                </marker>
              </defs>
              <path
                d="M 50 10 Q 50 50, 80 80"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
                className="arrowPath"
              />
            </svg>
          </div>
        </div>

        <div className="emptyStateTips" role="complementary" aria-label="Helpful tips">
          <div className="tip">
            <span className="tipIcon" aria-hidden="true">💡</span>
            <p>Good lighting makes better transformations</p>
          </div>
          <div className="tip">
            <span className="tipIcon" aria-hidden="true">🎭</span>
            <p>Try different expressions for unique results</p>
          </div>
          <div className="tip">
            <span className="tipIcon" aria-hidden="true">🖼️</span>
            <p>Face the camera directly for best results</p>
          </div>
        </div>
      </div>
    </li>
  )
}
