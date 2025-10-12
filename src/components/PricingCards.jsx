import { useState } from 'react'
import c from 'clsx'
import { useAuth } from '../contexts/AuthContext'
import { SUBSCRIPTION_TIERS } from '../lib/stripe/config'
import { createCheckoutSession } from '../lib/stripe/subscriptionService'

export default function PricingCards({ currentTierId = 'free' }) {
  const { user } = useAuth()
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [loading, setLoading] = useState(null)

  const handleSubscribe = async (tierId) => {
    if (!user) {
      alert('Please sign in to subscribe')
      return
    }

    if (tierId === 'free') {
      return
    }

    setLoading(tierId)
    try {
      await createCheckoutSession(tierId, billingCycle)
    } catch (error) {
      console.error('Error creating checkout:', error)
      alert('Failed to start checkout process')
      setLoading(null)
    }
  }

  const getButtonText = (tierId) => {
    if (loading === tierId) return 'Processing...'
    if (tierId === currentTierId) return 'Current Plan'
    if (tierId === 'free') return 'Free Forever'
    return 'Upgrade Now'
  }

  return (
    <div className="pricingCards">
      <div className="billingToggle">
        <button
          className={c({ active: billingCycle === 'monthly' })}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button
          className={c({ active: billingCycle === 'yearly' })}
          onClick={() => setBillingCycle('yearly')}
        >
          Yearly <span className="badge">Save 17%</span>
        </button>
      </div>

      <div className="cardsGrid">
        {Object.values(SUBSCRIPTION_TIERS).map((tier) => {
          const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly
          const isCurrent = tier.id === currentTierId
          const isPopular = tier.id === 'pro'

          return (
            <div
              key={tier.id}
              className={c('pricingCard', {
                current: isCurrent,
                popular: isPopular
              })}
            >
              {isPopular && <div className="popularBadge">Most Popular</div>}

              <div className="cardHeader">
                <h3>{tier.name}</h3>
                <div className="priceDisplay">
                  <span className="currency">$</span>
                  <span className="amount">{price}</span>
                  <span className="period">
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
              </div>

              <ul className="featuresList">
                {tier.features.map((feature, index) => (
                  <li key={index}>
                    <span className="checkmark">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={c('button', 'subscribeButton', {
                  primary: isPopular,
                  disabled: isCurrent || loading === tier.id
                })}
                onClick={() => handleSubscribe(tier.id)}
                disabled={isCurrent || loading === tier.id}
              >
                {getButtonText(tier.id)}
              </button>
            </div>
          )
        })}
      </div>

      <div className="guaranteeText">
        <p>✓ Cancel anytime • 30-day money-back guarantee • Secure payment with Stripe</p>
      </div>
    </div>
  )
}
