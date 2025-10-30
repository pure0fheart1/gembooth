import { supabase } from './supabase/client'

/**
 * Check if user can perform an action based on their usage limits
 * @param {string} userId - User ID
 * @param {string} actionType - Type of action: 'photo', 'gif', 'fitcheck', 'codrawing', 'pastforward', 'generated_image', 'pixshop'
 * @returns {Promise<{allowed: boolean, limit: number, used: number, message?: string}>}
 */
export async function checkUsageLimit(userId, actionType) {
  try {
    // Call the database function to check usage
    const { data, error } = await supabase.rpc('check_usage_limit', {
      p_user_id: userId,
      p_action_type: actionType
    })

    if (error) {
      console.error('Error checking usage limit:', error)
      // Allow by default if there's an error
      return { allowed: true, limit: -1, used: 0 }
    }

    // Get the current usage stats
    const { data: usage, error: usageError } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', userId)
      .lte('period_start', new Date().toISOString())
      .gte('period_end', new Date().toISOString())
      .single()

    if (usageError) {
      console.error('Error fetching usage:', usageError)
    }

    // Get the tier limits
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('tier_id, subscription_tiers(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subError) {
      console.error('Error fetching subscription:', subError)
    }

    const tier = subscription?.subscription_tiers
    const usedField = getUsageFieldName(actionType)
    const limitField = getLimitFieldName(actionType)
    const used = usage?.[usedField] || 0
    // Use nullish coalescing (??) to preserve -1 (unlimited) instead of replacing it with 0
    const limit = tier?.[limitField] ?? 0

    // Debug logging
    console.log('🔍 Usage Check Debug:', {
      actionType,
      subscription: subscription,
      tier: tier,
      limitField,
      limit,
      usedField,
      used,
      rpcData: data
    })

    if (!data && limit !== -1 && used >= limit) {
      return {
        allowed: false,
        limit,
        used,
        message: `You've reached your ${getFeatureName(actionType)} limit (${limit} per month). Upgrade to continue.`
      }
    }

    return { allowed: data, limit, used }
  } catch (err) {
    console.error('Unexpected error in checkUsageLimit:', err)
    return { allowed: true, limit: -1, used: 0 }
  }
}

/**
 * Increment usage count for a specific action
 * @param {string} userId - User ID
 * @param {string} actionType - Type of action: 'photo', 'gif', 'fitcheck', 'codrawing', 'pastforward', 'generated_image', 'pixshop'
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function incrementUsage(userId, actionType) {
  try {
    const { error } = await supabase.rpc('increment_usage', {
      p_user_id: userId,
      p_action_type: actionType
    })

    if (error) {
      console.error('Error incrementing usage:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected error in incrementUsage:', err)
    return { success: false, error: err }
  }
}

/**
 * Check usage and increment in a single operation
 * @param {string} userId - User ID
 * @param {string} actionType - Type of action
 * @returns {Promise<{allowed: boolean, limit: number, used: number, message?: string}>}
 */
export async function checkAndIncrementUsage(userId, actionType) {
  const result = await checkUsageLimit(userId, actionType)

  if (result.allowed) {
    await incrementUsage(userId, actionType)
  }

  return result
}

// Helper functions
function getUsageFieldName(actionType) {
  const mapping = {
    'photo': 'photos_used',
    'gif': 'gifs_used',
    'fitcheck': 'fitcheck_used',
    'codrawing': 'codrawing_used',
    'pastforward': 'pastforward_used',
    'generated_image': 'generated_images_used',
    'pixshop': 'pixshop_used'
  }
  return mapping[actionType] || 'photos_used'
}

function getLimitFieldName(actionType) {
  const mapping = {
    'photo': 'photos_per_month',
    'gif': 'gifs_per_month',
    'fitcheck': 'fitcheck_per_month',
    'codrawing': 'codrawing_per_month',
    'pastforward': 'pastforward_per_month',
    'generated_image': 'generated_images_per_month',
    'pixshop': 'pixshop_per_month'
  }
  return mapping[actionType] || 'photos_per_month'
}

function getFeatureName(actionType) {
  const mapping = {
    'photo': 'photo',
    'gif': 'GIF',
    'fitcheck': 'FitCheck',
    'codrawing': 'Co-Drawing',
    'pastforward': 'Past Forward',
    'generated_image': 'AI Image Generation',
    'pixshop': 'PixShop'
  }
  return mapping[actionType] || actionType
}
