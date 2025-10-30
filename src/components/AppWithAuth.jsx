/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import Auth from './Auth'
import App from './App'
import DemoMode from './DemoMode'
import PricingPage from './PricingPage'
import SubscriptionPage from './SubscriptionPage'
import SettingsPage from './SettingsPage'
import Gallery from './Gallery'
import ImageGeneration from './ImageGeneration'
import Whiteboard from './Whiteboard'
import CustomModeManager from './CustomModeManager'
import FitCheckApp from './FitCheck/FitCheckApp'
import CoDrawing from './CoDrawing'
import PastForward from './PastForward'
import PixShop from './PixShop'
import UsageLimitBanner from './UsageLimitBanner'
import UsageCounter, { UsageCounterToggle } from './UsageCounter'
import WelcomeTutorial from './Onboarding/WelcomeTutorial'
// import CookieConsent from './Legal/CookieConsent' // Temporarily disabled due to ad blocker

function Navigation() {
  const { signOut } = useAuth()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const menuRef = React.useRef(null)

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <nav className="appNav">
      <div className="navBrand">
        <Link to="/">📸 GemBooth</Link>
      </div>

      <div className="navLinks">
        <Link to="/fit-check" className={location.pathname === '/fit-check' ? 'active' : ''}>
          👔 Fit Check
        </Link>
        <Link to="/co-drawing" className={location.pathname === '/co-drawing' ? 'active' : ''}>
          🎨 Co-Drawing
        </Link>
        <Link to="/past-forward" className={location.pathname === '/past-forward' ? 'active' : ''}>
          ⏰ Past Forward
        </Link>
        <Link to="/pixshop" className={location.pathname === '/pixshop' ? 'active' : ''}>
          ✨ PixShop
        </Link>
        <Link to="/generate" className={location.pathname === '/generate' ? 'active' : ''}>
          Generate
        </Link>
        <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>
          Gallery
        </Link>
        <Link to="/whiteboard" className={location.pathname === '/whiteboard' ? 'active' : ''}>
          Whiteboard
        </Link>
        <Link to="/custom-modes" className={location.pathname === '/custom-modes' ? 'active' : ''}>
          ✨ My Modes
        </Link>

        <div className="userMenu" ref={menuRef}>
          <button
            className="userMenuButton"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <span className="icon">account_circle</span>
          </button>
          {showUserMenu && (
            <div className="userMenuDropdown">
              <Link to="/pricing" onClick={() => setShowUserMenu(false)}>
                💎 Pricing
              </Link>
              <Link to="/subscription" onClick={() => setShowUserMenu(false)}>
                📊 My Subscription
              </Link>
              <Link to="/settings" onClick={() => setShowUserMenu(false)}>
                ⚙️ Settings
              </Link>
              <div className="menuDivider"></div>
              <button onClick={() => { signOut(); setShowUserMenu(false); }}>
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function AppContent() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="loadingContainer">
        <h1>📸 GemBooth</h1>
        <p>Loading...</p>
      </div>
    )
  }

  // Handle demo mode route
  if (!user && location.pathname === '/demo') {
    return <DemoMode onSignUpClick={() => navigate('/signup')} />
  }

  // Handle auth routes (login, signup)
  if (!user && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Auth initialMode={location.pathname === '/signup' ? 'signup' : 'login'} />
  }

  // Default: show auth if not logged in
  if (!user) {
    return <Auth />
  }

  return (
    <>
      <Navigation />
      <UsageLimitBanner />
      <UsageCounter />
      <UsageCounterToggle />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/fit-check" element={<FitCheckApp />} />
        <Route path="/co-drawing" element={<CoDrawing />} />
        <Route path="/past-forward" element={<PastForward />} />
        <Route path="/pixshop" element={<PixShop />} />
        <Route path="/generate" element={<ImageGeneration />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/custom-modes" element={<CustomModeManager />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
      </Routes>
    </>
  )
}

function SubscriptionSuccess() {
  return (
    <div className="subscriptionPage successPage">
      <div className="successMessage">
        <h1>🎉 Welcome to GemBooth Premium!</h1>
        <p>Your subscription is now active. Enjoy all the premium features!</p>
        <div className="actionButtons">
          <Link to="/" className="button primary">Start Creating</Link>
          <Link to="/subscription" className="button">View Subscription</Link>
        </div>
      </div>
    </div>
  )
}

function SubscriptionCancel() {
  return (
    <div className="subscriptionPage cancelPage">
      <div className="cancelMessage">
        <h1>Subscription Canceled</h1>
        <p>No worries! You can upgrade anytime from the pricing page.</p>
        <div className="actionButtons">
          <Link to="/" className="button primary">Back to GemBooth</Link>
          <Link to="/pricing" className="button">View Plans</Link>
        </div>
      </div>
    </div>
  )
}

export default function AppWithAuth() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WelcomeTutorial />
        <AppContent />
        {/* <CookieConsent /> */}
      </AuthProvider>
    </BrowserRouter>
  )
}
