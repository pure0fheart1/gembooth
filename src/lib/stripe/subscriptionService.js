import { supabase } from '../supabase/client'
import { stripePromise } from './config'

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      tier:subscription_tiers(*)
    `)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching subscription:', error)
    return null
  }

  return data
}

/**
 * Get user's current usage limits
 */
export async function getUserUsage(userId) {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('usage_limits')
    .select('*')
    .eq('user_id', userId)
    .lte('period_start', now)
    .gte('period_end', now)
    .maybeSingle()

  if (error) {
    console.error('Error fetching usage:', error)
    return null
  }

  return data
}

/**
 * Check if user can perform an action based on their limits
 */
export async function checkUsageLimit(userId, actionType) {
  const { data, error } = await supabase.rpc('check_usage_limit', {
    p_user_id: userId,
    p_action_type: actionType
  })

  if (error) {
    console.error('Error checking usage limit:', error)
    return false
  }

  return data
}

/**
 * Increment usage counter
 */
export async function incrementUsage(userId, actionType) {
  const { error } = await supabase.rpc('increment_usage', {
    p_user_id: userId,
    p_action_type: actionType
  })

  if (error) {
    console.error('Error incrementing usage:', error)
    throw error
  }
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(tierId, billingCycle = 'monthly') {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: {
      tierId,
      billingCycle
    }
  })

  if (error || !data) {
    console.error('Error creating checkout session:', error)
    throw error || new Error('No session data returned')
  }

  const stripe = await stripePromise
  const { error: stripeError } = await stripe.redirectToCheckout({
    sessionId: data.session.id
  })

  if (stripeError) {
    console.error('Stripe redirect error:', stripeError)
    throw stripeError
  }
}

/**
 * Create Stripe customer portal session
 */
export async function createPortalSession(userId) {
  const { data: { url }, error } = await supabase.functions.invoke('create-portal-session', {
    body: { userId }
  })

  if (error) {
    console.error('Error creating portal session:', error)
    throw error
  }

  window.location.href = url
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(userId) {
  const { error } = await supabase.functions.invoke('cancel-subscription', {
    body: { userId }
  })

  if (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

/**
 * Resume canceled subscription
 */
export async function resumeSubscription(userId) {
  const { error } = await supabase.functions.invoke('resume-subscription', {
    body: { userId }
  })

  if (error) {
    console.error('Error resuming subscription:', error)
    throw error
  }
}
