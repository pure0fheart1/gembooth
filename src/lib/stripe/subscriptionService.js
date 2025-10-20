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
  // Get the current session to ensure we have auth token
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('You must be logged in to subscribe')
  }

  console.log('Creating checkout with session:', session.user.id)

  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    headers: {
      Authorization: `Bearer ${session.access_token}`
    },
    body: {
      tierId,
      billingCycle
    }
  })

  if (error || !data) {
    console.error('Error creating checkout session:', error)
    throw error || new Error('No session data returned')
  }

  // Redirect directly to the Stripe checkout URL
  window.location.href = data.session.url
}

/**
 * Create Stripe customer portal session
 */
export async function createPortalSession(userId) {
  console.log('[Portal] Starting portal session creation for user:', userId)

  // Get the current session to ensure we have auth token
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    console.error('[Portal] No session found')
    throw new Error('You must be logged in to manage subscription')
  }

  console.log('[Portal] Session found, user:', session.user.id)
  console.log('[Portal] Invoking Edge Function...')

  const { data, error } = await supabase.functions.invoke('create-portal-session', {
    headers: {
      Authorization: `Bearer ${session.access_token}`
    },
    body: { userId }
  })

  console.log('[Portal] Edge Function response:', { data, error })

  // Check for Supabase function invocation error
  if (error) {
    console.error('[Portal] Supabase function error:', error)
    throw new Error(error.message || 'Failed to invoke Edge Function')
  }

  // Check if response exists
  if (!data) {
    console.error('[Portal] No data returned from Edge Function')
    throw new Error('No response from portal service')
  }

  // Check if Edge Function returned an error in the data
  if (data.error) {
    console.error('[Portal] Edge Function returned error:', data.error)
    throw new Error(data.error)
  }

  // Check if we have the portal URL
  if (!data.url) {
    console.error('[Portal] No portal URL in response:', data)
    throw new Error('Portal URL not found in response')
  }

  console.log('[Portal] Redirecting to:', data.url)
  // Redirect directly to the Stripe portal URL
  window.location.href = data.url
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
