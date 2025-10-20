import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'npm:stripe@^17.0.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    console.log('🔐 Authorization header:', authHeader ? 'Present' : 'MISSING')
    console.log('📋 All headers:', Object.fromEntries(req.headers.entries()))

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader! },
        },
      }
    )

    // Extract token and pass directly to getUser
    const token = authHeader?.replace('Bearer ', '')
    console.log('🎫 Token extracted:', token ? 'Yes' : 'No')

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    console.log('👤 User from auth:', user ? user.id : 'null')
    console.log('🚫 Auth error:', authError)

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { tierId, billingCycle } = await req.json()

    // Get or create Stripe customer
    let customerId: string | null = null
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Update or create subscription record with Stripe customer ID
      if (subscription) {
        await supabase
          .from('subscriptions')
          .update({ stripe_customer_id: customerId })
          .eq('user_id', user.id)
      } else {
        // Create initial subscription record
        await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            tier_id: 'free',
            stripe_customer_id: customerId,
            status: 'active'
          })
      }
    }

    // Get tier details
    const { data: tier } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('id', tierId)
      .single()

    if (!tier) {
      throw new Error('Invalid tier')
    }

    const priceId = billingCycle === 'yearly'
      ? tier.stripe_price_id_yearly
      : tier.stripe_price_id_monthly

    if (!priceId) {
      throw new Error(`Price not configured for ${tierId} ${billingCycle} billing cycle`)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/subscription/cancel`,
      metadata: {
        user_id: user.id,
        tier_id: tierId,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          tier_id: tierId,
        },
      },
    })

    return new Response(
      JSON.stringify({ session }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('❌ Checkout error:', error.message)
    console.error('Full error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
