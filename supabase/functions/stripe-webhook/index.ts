import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.11.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  let event: Stripe.Event

  try {
    const body = await req.text()

    // Check if this is a pre-verified event from Vercel proxy (no signature header)
    if (!signature) {
      // Parse the already-verified event from the request body
      event = JSON.parse(body)
      console.log('Received pre-verified event from Vercel proxy:', event.type)
    } else {
      // Verify the raw webhook from Stripe
      if (!webhookSecret) {
        return new Response('Missing webhook secret', { status: 400 })
      }
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret,
        undefined,
        cryptoProvider
      )
      console.log('Verified direct webhook from Stripe:', event.type)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const tierId = session.metadata?.tier_id

        if (userId && tierId && session.subscription) {
          await supabase
            .from('subscriptions')
            .update({
              tier_id: tierId,
              stripe_subscription_id: session.subscription as string,
              status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('user_id', userId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id

        if (userId) {
          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            })
            .eq('user_id', userId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id

        if (userId) {
          // Reset to free tier
          await supabase
            .from('subscriptions')
            .update({
              tier_id: 'free',
              status: 'canceled',
              stripe_subscription_id: null,
            })
            .eq('user_id', userId)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.customer && invoice.subscription) {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', invoice.customer as string)
            .single()

          if (subscription) {
            await supabase.from('payments').insert({
              user_id: subscription.user_id,
              stripe_payment_id: invoice.id,
              amount: invoice.amount_paid / 100,
              currency: invoice.currency,
              status: 'succeeded',
              description: invoice.description || 'Subscription payment',
            })
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.customer) {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', invoice.customer as string)
            .single()

          if (subscription) {
            await supabase
              .from('subscriptions')
              .update({ status: 'past_due' })
              .eq('user_id', subscription.user_id)
          }
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
