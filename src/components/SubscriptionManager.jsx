import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  getUserSubscription,
  getUserUsage,
  createPortalSession
} from '../lib/stripe/subscriptionService'
import { SUBSCRIPTION_TIERS } from '../lib/stripe/config'

export default function SubscriptionManager() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [usage, setUsage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSubscriptionData()
    }
  }, [user])

  const loadSubscriptionData = async () => {
    setLoading(true)
    try {
      const [subData, usageData] = await Promise.all([
        getUserSubscription(user.id),
        getUserUsage(user.id)
      ])
      setSubscription(subData)
      setUsage(usageData)
    } catch (error) {
      console.error('Error loading subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      console.log('Opening portal for user:', user.id)
      await createPortalSession(user.id)
    } catch (error) {
      console.error('Error opening portal:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      alert(`Failed to open subscription management portal: ${error.message || 'Unknown error'}`)
    }
  }

  if (loading) {
    return (
      <div className="subscriptionManager loading">
        <p>Loading subscription...</p>
      </div>
    )
  }

  if (!subscription) {
    return null
  }

  const tier = SUBSCRIPTION_TIERS[subscription.tier_id] || SUBSCRIPTION_TIERS.free
  const photosLimit = tier.photosPerMonth === -1 ? '∞' : tier.photosPerMonth
  const gifsLimit = tier.gifsPerMonth === -1 ? '∞' : tier.gifsPerMonth
  const photosUsed = usage?.photos_used || 0
  const gifsUsed = usage?.gifs_used || 0
  const photosPercentage = tier.photosPerMonth === -1 ? 0 : (photosUsed / tier.photosPerMonth) * 100
  const gifsPercentage = tier.gifsPerMonth === -1 ? 0 : (gifsUsed / tier.gifsPerMonth) * 100

  return (
    <div className="subscriptionManager">
      <div className="subscriptionCard">
        <div className="tierInfo">
          <h2>{tier.name} Plan</h2>
          {subscription.tier_id !== 'free' && (
            <p className="price">
              ${subscription.billing_cycle === 'yearly' ? tier.priceYearly : tier.priceMonthly}
              /{subscription.billing_cycle === 'yearly' ? 'year' : 'month'}
            </p>
          )}
          <div className={`status ${subscription.status}`}>
            {subscription.status === 'active' ? '✓ Active' : subscription.status}
          </div>
        </div>

        <div className="usageStats">
          <div className="usageStat">
            <div className="statHeader">
              <span>Photos</span>
              <span>{photosUsed} / {photosLimit}</span>
            </div>
            <div className="progressBar">
              <div
                className="progressFill"
                style={{ width: `${Math.min(photosPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="usageStat">
            <div className="statHeader">
              <span>GIFs</span>
              <span>{gifsUsed} / {gifsLimit}</span>
            </div>
            <div className="progressBar">
              <div
                className="progressFill"
                style={{ width: `${Math.min(gifsPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="features">
          <h3>Plan Features</h3>
          <ul>
            {tier.features.map((feature, index) => (
              <li key={index}>✓ {feature}</li>
            ))}
          </ul>
        </div>

        {subscription.tier_id !== 'free' && (
          <button className="button manageButton" onClick={handleManageSubscription}>
            Manage Subscription
          </button>
        )}

        {subscription.cancel_at_period_end && (
          <div className="cancelNotice">
            ⚠️ Your subscription will cancel at the end of the current billing period
          </div>
        )}
      </div>
    </div>
  )
}
