/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState, useEffect } from 'react'
import './CookieConsent.css'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all')
    localStorage.setItem('analyticsEnabled', 'true')
    setIsVisible(false)
  }

  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential')
    localStorage.setItem('analyticsEnabled', 'false')
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="cookieBanner">
      <div className="cookieContent">
        <div className="cookieText">
          <h3>🍪 We use cookies</h3>
          <p>
            We use essential cookies for authentication and optional cookies for analytics to improve your experience.
            {!showDetails && (
              <button 
                className="cookieLink"
                onClick={() => setShowDetails(true)}
              >
                Learn more
              </button>
            )}
          </p>
          
          {showDetails && (
            <div className="cookieDetails">
              <p><strong>Essential Cookies:</strong> Required for authentication and core functionality.</p>
              <p><strong>Analytics Cookies:</strong> Help us understand how you use GemBooth to improve the app.</p>
            </div>
          )}
        </div>

        <div className="cookieActions">
          <button 
            className="cookieBtn secondary"
            onClick={acceptEssential}
          >
            Essential Only
          </button>
          <button 
            className="cookieBtn primary"
            onClick={acceptAll}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
