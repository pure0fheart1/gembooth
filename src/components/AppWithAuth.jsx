/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import Auth from './Auth'
import App from './App'
import PricingPage from './PricingPage'
import SubscriptionPage from './SubscriptionPage'
import UsageLimitBanner from './UsageLimitBanner'

function Navigation() {
  const { signOut } = useAuth()
  const location = useLocation()

  return (
    <nav className="appNav">
      <div className="navBrand">
        <Link to="/">📸 GemBooth</Link>
      </div>
      <div className="navLinks">
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

  if (loading) {
    return (
      <div className="loadingContainer">
        <h1>📸 GemBooth</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <>
      <Navigation />
      <UsageLimitBanner />
      <Routes>
        <Route path="/" element={<App />} />
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
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}
