import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUserSubscription, getUserUsage } from '../lib/stripe/subscriptionService'
import { SUBSCRIPTION_TIERS } from '../lib/stripe/config'
import './UsageCounter.css'

export default function UsageCounter() {
  const { user } = useAuth()
  const [usage, setUsage] = useState(null)
  const [tier, setTier] = useState(null)
  const [loading, setLoading] = useState(true)

  // Widget state
  const [isMinimized, setIsMinimized] = useState(() => {
    const saved = localStorage.getItem('usageCounter-minimized')
    return saved === 'true'
  })
  const [isVisible, setIsVisible] = useState(() => {
    const saved = localStorage.getItem('usageCounter-visible')
    return saved !== 'false' // Default to visible
  })
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('usageCounter-position')
    return saved ? JSON.parse(saved) : { x: 20, y: 100 }
  })

  // Dragging state
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const dragHandleRef = useRef(null)

  useEffect(() => {
    if (user) {
      loadUsageData()
      // Refresh every 10 seconds
      const interval = setInterval(loadUsageData, 10000)
      return () => clearInterval(interval)
    }
  }, [user])

  // Listen for storage changes (from toggle button)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('usageCounter-visible')
      setIsVisible(saved !== 'false')
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('usageCounter-minimized', isMinimized)
  }, [isMinimized])

  useEffect(() => {
    localStorage.setItem('usageCounter-visible', isVisible)
  }, [isVisible])

  useEffect(() => {
    localStorage.setItem('usageCounter-position', JSON.stringify(position))
  }, [position])

  // Handle mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return

      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y

      // Keep within viewport bounds
      const maxX = window.innerWidth - 320 // Widget width
      const maxY = window.innerHeight - (isMinimized ? 60 : 300) // Approximate heights

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
      }
    }
  }, [isDragging, dragStart, isMinimized])

  const handleMouseDown = (e) => {
    // Only start drag from the drag handle
    if (dragHandleRef.current?.contains(e.target)) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const loadUsageData = async () => {
    try {
      const [subscription, usageData] = await Promise.all([
        getUserSubscription(user.id),
        getUserUsage(user.id)
      ])

      if (subscription && usageData) {
        const tierConfig = SUBSCRIPTION_TIERS[subscription.tier_id] || SUBSCRIPTION_TIERS.free
        setTier(tierConfig)
        setUsage(usageData)
      }
    } catch (error) {
      console.error('Error loading usage data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const closeWidget = () => {
    setIsVisible(false)
  }

  if (!user || loading) return null
  if (!usage || !tier) return null
  if (!isVisible) return null

  const getPhotosPercentage = () => {
    if (tier.photosPerMonth === -1) return 0 // Unlimited
    return Math.min((usage.photos_used / tier.photosPerMonth) * 100, 100)
  }

  const getGifsPercentage = () => {
    if (tier.gifsPerMonth === -1) return 0 // Unlimited
    return Math.min((usage.gifs_used / tier.gifsPerMonth) * 100, 100)
  }

  const photosRemaining = tier.photosPerMonth === -1
    ? '∞'
    : Math.max(0, tier.photosPerMonth - usage.photos_used)

  const gifsRemaining = tier.gifsPerMonth === -1
    ? '∞'
    : Math.max(0, tier.gifsPerMonth - usage.gifs_used)

  const photosPercent = getPhotosPercentage()
  const gifsPercent = getGifsPercentage()

  const getStatusColor = (percent) => {
    if (percent >= 90) return 'critical'
    if (percent >= 75) return 'warning'
    return 'good'
  }

  return (
    <div
      className={`usageCounterFloating ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag Handle & Controls */}
      <div className="usageCounterDragHandle" ref={dragHandleRef}>
        <div className="dragIndicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="usageCounterControls">
          <button
            className="controlButton minimize"
            onClick={toggleMinimize}
            title={isMinimized ? "Expand" : "Minimize"}
            aria-label={isMinimized ? "Expand widget" : "Minimize widget"}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button
            className="controlButton close"
            onClick={closeWidget}
            title="Close"
            aria-label="Close widget"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="usageCounterHeader">
        <span className="usageTierBadge">{tier.name}</span>
        <a href="/pricing" className="upgradeLink">Upgrade</a>
      </div>

      {/* Content (hidden when minimized) */}
      {!isMinimized && (
        <div className="usageMetrics">
          {/* Photos Usage */}
          <div className="usageMetric">
            <div className="usageMetricHeader">
              <span className="usageMetricIcon">📸</span>
              <span className="usageMetricLabel">Photos</span>
              <span className={`usageMetricValue ${getStatusColor(photosPercent)}`}>
                {photosRemaining}
              </span>
            </div>
            {tier.photosPerMonth !== -1 && (
              <>
                <div className="usageProgressBar">
                  <div
                    className={`usageProgressFill ${getStatusColor(photosPercent)}`}
                    style={{ width: `${photosPercent}%` }}
                  />
                </div>
                <div className="usageMetricFooter">
                  {usage.photos_used} / {tier.photosPerMonth}
                </div>
              </>
            )}
            {tier.photosPerMonth === -1 && (
              <div className="usageMetricFooter unlimited">Unlimited</div>
            )}
          </div>

          {/* GIFs Usage */}
          <div className="usageMetric">
            <div className="usageMetricHeader">
              <span className="usageMetricIcon">🎞️</span>
              <span className="usageMetricLabel">GIFs</span>
              <span className={`usageMetricValue ${getStatusColor(gifsPercent)}`}>
                {gifsRemaining}
              </span>
            </div>
            {tier.gifsPerMonth !== -1 && (
              <>
                <div className="usageProgressBar">
                  <div
                    className={`usageProgressFill ${getStatusColor(gifsPercent)}`}
                    style={{ width: `${gifsPercent}%` }}
                  />
                </div>
                <div className="usageMetricFooter">
                  {usage.gifs_used} / {tier.gifsPerMonth}
                </div>
              </>
            )}
            {tier.gifsPerMonth === -1 && (
              <div className="usageMetricFooter unlimited">Unlimited</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Export a toggle button component that can be used to restore the widget
export function UsageCounterToggle() {
  const [isVisible, setIsVisible] = useState(() => {
    const saved = localStorage.getItem('usageCounter-visible')
    return saved !== 'false'
  })

  const showWidget = () => {
    localStorage.setItem('usageCounter-visible', 'true')
    setIsVisible(true)
    // Trigger re-render of UsageCounter by dispatching a storage event
    window.dispatchEvent(new Event('storage'))
  }

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('usageCounter-visible')
      setIsVisible(saved !== 'false')
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  if (isVisible) return null

  return (
    <button
      className="usageCounterRestoreButton"
      onClick={showWidget}
      title="Show usage widget"
      aria-label="Show usage widget"
    >
      📊
    </button>
  )
}
