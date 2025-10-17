/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import Auth from './Auth'
import App from './App'
import DemoMode from './DemoMode'
import PricingPage from './PricingPage'
import SubscriptionPage from './SubscriptionPage'
import Gallery from './Gallery'
import UsageLimitBanner from './UsageLimitBanner'
import WelcomeTutorial from './Onboarding/WelcomeTutorial'
import CookieConsent from './Legal/CookieConsent'

function Navigation() {
  const { signOut } = useAuth()
  const location = useLocation()

  return (
    <nav className="appNav">
      <div className="navBrand">
        <Link to="/">📸 GemBooth</Link>
      </div>
      <div className="navLinks">
        <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>
          Gallery
        </Link>
        <Link to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>
          Pricing
        </Link>
        <Link to="/subscription" className={location.pathname === '/subscription' ? 'active' : ''}>
          My Subscription
        </Link>
        <button className="signOutButton" onClick={signOut}>
          Sign Out
        </button>
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
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
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
        <CookieConsent />
      </AuthProvider>
    </BrowserRouter>
  )
}
