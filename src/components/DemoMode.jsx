/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import App from './App'
import useStore from '../lib/store'
import WelcomeTutorial from './Onboarding/WelcomeTutorial'

const MAX_DEMO_PHOTOS = 5

export default function DemoMode() {
  const navigate = useNavigate()
  const [showTutorial, setShowTutorial] = useState(false)
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false)
  const [demoBannerDismissed, setDemoBannerDismissed] = useState(false)
  const photos = useStore.use.photos()

  const handleNavigateToSignup = () => navigate('/signup')
  const handleNavigateToLogin = () => navigate('/login')

  useEffect(() => {
    // Check if user has seen tutorial
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    if (!hasSeenTutorial) {
      setShowTutorial(true)
    }

    // Check if demo banner was dismissed in this session
    const bannerDismissed = sessionStorage.getItem('demoBannerDismissed')
    if (bannerDismissed) {
      setDemoBannerDismissed(true)
    }
  }, [])

  useEffect(() => {
    // Show signup prompt after first photo
    if (photos.length === 1 && !photos[0].isBusy) {
      const timer = setTimeout(() => {
        setShowSignUpPrompt(true)
      }, 2000)
      return () => clearTimeout(timer)
    }

    // Block photo creation if limit reached
    if (photos.length >= MAX_DEMO_PHOTOS) {
      setShowSignUpPrompt(true)
    }
  }, [photos])

  const handleDismissBanner = () => {
    setDemoBannerDismissed(true)
    sessionStorage.setItem('demoBannerDismissed', 'true')
  }

  const handleClosePrompt = () => {
    setShowSignUpPrompt(false)
  }

  const isLimitReached = photos.length >= MAX_DEMO_PHOTOS

  return (
    <>
      {showTutorial && (
        <WelcomeTutorial
          onComplete={() => setShowTutorial(false)}
          onSkip={() => setShowTutorial(false)}
        />
      )}

      {!demoBannerDismissed && (
        <div className="demoBanner">
          <div className="demoBannerContent">
            <span className="bannerIcon">🎨</span>
            <p>
              <strong>You're in Demo Mode</strong> - Sign up to save your photos forever!
            </p>
            <button onClick={handleNavigateToSignup} className="demoBannerLink">
              Sign Up Free
            </button>
          </div>
          <button
            className="bannerClose"
            onClick={handleDismissBanner}
            aria-label="Dismiss banner"
          >
            <span className="icon">close</span>
          </button>
        </div>
      )}

      {showSignUpPrompt && (
        <div className="signUpPromptOverlay" onClick={handleClosePrompt}>
          <div className="signUpPromptModal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modalClose"
              onClick={handleClosePrompt}
              aria-label="Close"
            >
              <span className="icon">close</span>
            </button>

            {isLimitReached ? (
              <>
                <div className="promptIcon">🎉</div>
                <h2>You've reached the demo limit!</h2>
                <p>
                  Loving the transformations? Sign up for a free account to:
                </p>
                <ul className="promptFeatures">
                  <li>
                    <span className="checkmark">✓</span>
                    Create unlimited photos
                  </li>
                  <li>
                    <span className="checkmark">✓</span>
                    Save your creations forever
                  </li>
                  <li>
                    <span className="checkmark">✓</span>
                    Make animated GIFs
                  </li>
                  <li>
                    <span className="checkmark">✓</span>
                    Access from any device
                  </li>
                </ul>
              </>
            ) : (
              <>
                <div className="promptIcon">💾</div>
                <h2>Love your transformation?</h2>
                <p>
                  Sign up now to save your photos and unlock unlimited creations!
                </p>
                <ul className="promptFeatures">
                  <li>
                    <span className="checkmark">✓</span>
                    Save all your photos
                  </li>
                  <li>
                    <span className="checkmark">✓</span>
                    Create animated GIFs
                  </li>
                  <li>
                    <span className="checkmark">✓</span>
                    Free account - no credit card needed
                  </li>
                </ul>
              </>
            )}

            <div className="promptActions">
              <button
                className="button primary large"
                onClick={handleNavigateToSignup}
              >
                Sign Up Free
              </button>
              {!isLimitReached && (
                <button
                  className="button secondary"
                  onClick={handleClosePrompt}
                >
                  Continue Demo ({MAX_DEMO_PHOTOS - photos.length} left)
                </button>
              )}
            </div>

            <p className="promptFooter">
              Already have an account? <button onClick={handleNavigateToLogin} className="linkButton">Sign In</button>
            </p>
          </div>
        </div>
      )}

      {isLimitReached && (
        <div className="demoLimitOverlay">
          <div className="demoLimitMessage">
            <h3>Demo Limit Reached</h3>
            <p>Sign up to continue creating</p>
            <button onClick={handleNavigateToSignup} className="button primary">
              Sign Up Now
            </button>
          </div>
        </div>
      )}

      <App isDemo={true} photoLimit={MAX_DEMO_PHOTOS} />
    </>
  )
}
