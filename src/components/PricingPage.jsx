import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUserSubscription } from '../lib/stripe/subscriptionService'
import PricingCards from './PricingCards'

export default function PricingPage() {
  const { user } = useAuth()
  const [currentTier, setCurrentTier] = useState('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSubscription()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadSubscription = async () => {
    try {
      const subscription = await getUserSubscription(user.id)
      if (subscription) {
        setCurrentTier(subscription.tier_id)
      }
    } catch (error) {
      console.error('Error loading subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pricingPage">
      <div className="pricingHeader">
        <h1>Choose Your Plan</h1>
        <p>Unlock more creativity with GemBooth Pro and Premium</p>
      </div>

      {loading ? (
        <div className="loadingMessage">Loading plans...</div>
      ) : (
        <PricingCards currentTierId={currentTier} />
      )}

      <div className="faqSection">
        <h2>Frequently Asked Questions</h2>
        <div className="faqGrid">
          <div className="faqItem">
            <h3>Can I cancel anytime?</h3>
            <p>Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing period.</p>
          </div>
          <div className="faqItem">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards through our secure payment processor, Stripe.</p>
          </div>
          <div className="faqItem">
            <h3>Do unused credits roll over?</h3>
            <p>No, credits reset at the beginning of each billing cycle. However, Premium users have unlimited access.</p>
          </div>
          <div className="faqItem">
            <h3>Can I upgrade or downgrade my plan?</h3>
            <p>Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades at the end of your current billing period.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
