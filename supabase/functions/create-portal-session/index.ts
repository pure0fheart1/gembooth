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
    console.log('🔐 [Portal] Starting portal session creation')

    // Extract JWT token from Authorization header
    const authHeader = req.headers.get('Authorization')
    console.log('🔑 [Portal] Auth header present:', !!authHeader)

    if (!authHeader) {
      throw new Error('No authorization header')
    }
    const token = authHeader.replace('Bearer ', '')

    // Create Supabase client with user's auth token for RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    console.log('👤 [Portal] User authenticated:', user?.id)
    console.log('❌ [Portal] Auth error:', authError?.message)

    if (authError || !user) {
      throw new Error('Not authenticated')
    }

    // Get or create Stripe customer
    let customerId: string
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('📊 [Portal] Subscription query error:', subError?.message)
    console.log('💳 [Portal] Existing customer ID:', subscription?.stripe_customer_id)

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id
      console.log('✅ [Portal] Using existing customer:', customerId)
    } else {
      // Create Stripe customer if it doesn't exist
      console.log('🆕 [Portal] Creating new Stripe customer for:', user.email)

      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id
      console.log('✅ [Portal] Created customer:', customerId)

      // Update or create subscription record with Stripe customer ID
      if (subscription) {
        console.log('📝 [Portal] Updating existing subscription with customer ID')
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ stripe_customer_id: customerId })
          .eq('user_id', user.id)

        if (updateError) {
          console.error('❌ [Portal] Error updating subscription:', updateError)
        }
      } else {
        console.log('📝 [Portal] Creating new subscription record')
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            tier_id: 'free',
            stripe_customer_id: customerId,
            status: 'active'
          })

        if (insertError) {
          console.error('❌ [Portal] Error creating subscription:', insertError)
        }
      }
    }

    // Verify customer exists in Stripe
    console.log('🔍 [Portal] Verifying customer exists in Stripe:', customerId)
    try {
      const customer = await stripe.customers.retrieve(customerId)
      console.log('✅ [Portal] Customer verified in Stripe:', customer.id)
    } catch (customerError) {
      console.error('💥 [Portal] Customer not found in Stripe:', customerError.message)
      throw new Error(`Customer ${customerId} not found in Stripe: ${customerError.message}`)
    }

    console.log('🔄 [Portal] Creating Stripe portal session for customer:', customerId)

    let session
    try {
      session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.get('origin')}/subscription`,
      })
      console.log('✅ [Portal] Portal session created:', session.id)
    } catch (stripeError) {
      console.error('💥 [Portal] Stripe API error:', stripeError)
      console.error('💥 [Portal] Stripe error type:', stripeError.type)
      console.error('💥 [Portal] Stripe error message:', stripeError.message)
      console.error('💥 [Portal] Stripe error code:', stripeError.code)

      // Check if it's a billing portal configuration issue
      if (stripeError.message?.includes('billing portal') || stripeError.message?.includes('portal')) {
        throw new Error('Stripe Customer Portal is not configured. Please enable it in Stripe Dashboard → Settings → Billing → Customer Portal')
      }

      throw new Error(`Stripe error: ${stripeError.message}`)
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('💥 [Portal] Fatal error:', error)
    console.error('💥 [Portal] Error message:', error.message)
    console.error('💥 [Portal] Error stack:', error.stack)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
