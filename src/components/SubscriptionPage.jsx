import { useAuth } from '../contexts/AuthContext'
import SubscriptionManager from './SubscriptionManager'

export default function SubscriptionPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="subscriptionPage">
        <div className="notAuthenticated">
          <h2>Sign In Required</h2>
          <p>Please sign in to view your subscription details.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="subscriptionPage">
      <div className="pageHeader">
        <h1>My Subscription</h1>
        <p>Manage your subscription and view usage</p>
      </div>
      <SubscriptionManager />
    </div>
  )
}
