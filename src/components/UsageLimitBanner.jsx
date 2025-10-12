import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUserSubscription, getUserUsage } from '../lib/stripe/subscriptionService'
import { SUBSCRIPTION_TIERS } from '../lib/stripe/config'

export default function UsageLimitBanner() {
  const { user } = useAuth()
  const [showBanner, setShowBanner] = useState(false)
  const [bannerMessage, setBannerMessage] = useState('')
  const [bannerType, setBannerType] = useState('warning') // 'warning' or 'error'

  useEffect(() => {
    if (user) {
      checkUsageLimits()
    }
  }, [user])

  const checkUsageLimits = async () => {
    try {
      const [subscription, usage] = await Promise.all([
        getUserSubscription(user.id),
        getUserUsage(user.id)
      ])

      if (!subscription || !usage) return

      const tier = SUBSCRIPTION_TIERS[subscription.tier_id] || SUBSCRIPTION_TIERS.free

      // Skip if unlimited
      if (tier.photosPerMonth === -1) return

      const photosPercent = (usage.photos_used / tier.photosPerMonth) * 100
      const gifsPercent = (usage.gifs_used / tier.gifsPerMonth) * 100

      if (photosPercent >= 100 || gifsPercent >= 100) {
        setBannerType('error')
        setBannerMessage(
          `You've reached your ${tier.name} plan limit. Upgrade to continue creating!`
        )
        setShowBanner(true)
      } else if (photosPercent >= 80 || gifsPercent >= 80) {
        setBannerType('warning')
        setBannerMessage(
          `You're running low on credits. Consider upgrading to ${
            tier.id === 'free' ? 'Pro' : 'Premium'
          } for more.`
        )
        setShowBanner(true)
      } else {
        setShowBanner(false)
      }
    } catch (error) {
      console.error('Error checking usage limits:', error)
    }
  }

  if (!showBanner) return null

  return (
    <div className={`usageLimitBanner ${bannerType}`}>
      <span className="bannerIcon">
        {bannerType === 'error' ? '⚠️' : 'ℹ️'}
      </span>
      <span className="bannerMessage">{bannerMessage}</span>
      <a href="/pricing" className="bannerLink">
        View Plans →
      </a>
      <button className="bannerClose" onClick={() => setShowBanner(false)}>
        ×
      </button>
    </div>
  )
}
