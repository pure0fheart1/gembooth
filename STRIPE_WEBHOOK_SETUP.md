# Stripe Webhook Setup - Complete ✅

## What Was Configured

Your Stripe webhook integration is now set up for the gembooth project! Here's what was implemented:

### 1. Webhook Events Configured in Stripe Dashboard
The following 5 webhook events are now being sent to your application:
- `checkout.session.completed` - When a customer completes checkout
- `customer.subscription.updated` - When a subscription is modified
- `customer.subscription.deleted` - When a subscription is canceled
- `invoice.payment_succeeded` - When a payment succeeds
- `invoice.payment_failed` - When a payment fails

**Webhook Endpoint:** `https://gembooth.vercel.app/api/webhooks/stripe`
**Webhook ID:** `we_1SHHrEEG7Jir5vNmdZSebPId`
**Webhook Secret:** `whsec_0KxnKyXUaXWjdMPgjGZJfhot2cEoOTDk` (stored in .env.local)

### 2. Vercel API Route Created
Created `api/webhooks/stripe.ts` that:
- Receives webhooks from Stripe
- Verifies webhook signatures for security
- Forwards verified events to your Supabase Edge Function
- Handles errors gracefully

### 3. Supabase Edge Function Updated
Updated `supabase/functions/stripe-webhook/index.ts` to:
- Accept pre-verified events from the Vercel proxy
- Still support direct webhooks (with signature verification)
- Process all 5 webhook event types
- Update your Supabase database accordingly

### 4. Dependencies Installed
- Added `@vercel/node` (v5.3.26) for Vercel API route types

### 5. Configuration Files
- Created `vercel.json` with API function configuration
- Updated `.env.local` with webhook secret

## ⚠️ IMPORTANT: Action Required

### You Need to Add Your Stripe Secret Key

Open `.env.local` and replace the placeholder with your actual Stripe secret key:

```bash
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE  # ← Replace this!
```

**Where to find your Stripe secret key:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. In the "Secret key" section, click "Reveal test key"
3. Copy the key (starts with `sk_test_`)
4. Replace the placeholder in `.env.local`

**⚠️ Security Note:** Never commit your secret key to git! It's already in `.gitignore`.

## How the Webhook Flow Works

```
Stripe Webhook
    ↓
Vercel API Route (api/webhooks/stripe.ts)
    ├─ Verifies webhook signature using STRIPE_SECRET_KEY
    ├─ Ensures the webhook came from Stripe
    ↓
Supabase Edge Function (stripe-webhook)
    ├─ Receives verified event
    ├─ Processes based on event type
    ├─ Updates database tables (subscriptions, payments)
    ↓
Database Updated
```

## Testing Your Webhook

### Using Stripe CLI (Recommended)
```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Test the webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger a test event
stripe trigger checkout.session.completed
```

### Using Stripe Dashboard
1. Go to https://dashboard.stripe.com/test/webhooks
2. Click on your webhook endpoint
3. Click "Send test webhook"
4. Select an event type to test
5. Check the "Logs" tab to see the result

## Webhook Event Handlers

### checkout.session.completed
- Updates subscription status to "active"
- Stores Stripe subscription ID
- Sets subscription period

### customer.subscription.updated
- Updates subscription status
- Updates billing period dates
- Handles subscription changes

### customer.subscription.deleted
- Resets user to free tier
- Marks subscription as "canceled"
- Removes Stripe subscription ID

### invoice.payment_succeeded
- Records successful payment in database
- Tracks payment amount and currency

### invoice.payment_failed
- Updates subscription status to "past_due"
- Allows you to notify the user

## Deployment

Once you've added your Stripe secret key:

```bash
# Deploy to Vercel
vercel --prod

# Or if using git:
git add .
git commit -m "Add Stripe webhook integration"
git push
```

The webhook will automatically work after deployment because:
1. Vercel will deploy the API route
2. The Supabase Edge Function is already deployed
3. Stripe knows to send webhooks to your Vercel URL

## Environment Variables Required

Make sure these are set in Vercel (they should auto-sync from .env.local):

```bash
VITE_SUPABASE_URL=https://cahdabrkluflhlwexqsc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
STRIPE_SECRET_KEY=sk_test_...  # ← Add this!
STRIPE_WEBHOOK_SECRET=whsec_0KxnKyXUaXWjdMPgjGZJfhot2cEoOTDk
```

## Troubleshooting

### Webhook signature verification fails
- Check that `STRIPE_WEBHOOK_SECRET` matches the one in Stripe dashboard
- Check that `STRIPE_SECRET_KEY` is correct

### Edge Function returns 500 error
- Check Supabase Edge Function logs
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Ensure database tables exist (subscriptions, payments)

### No webhooks received
- Check Stripe dashboard webhook logs
- Verify the endpoint URL is correct
- Check Vercel deployment logs

## Next Steps

1. ✅ Add your Stripe secret key to `.env.local`
2. ✅ Test the webhook locally with Stripe CLI
3. ✅ Deploy to Vercel
4. ✅ Test with a real Stripe checkout
5. ✅ Monitor webhook logs in both Stripe and Vercel

## File Structure

```
gembooth/
├── api/
│   └── webhooks/
│       └── stripe.ts                    # Vercel API route (webhook receiver)
├── supabase/
│   └── functions/
│       └── stripe-webhook/
│           └── index.ts                 # Supabase Edge Function (event processor)
├── .env.local                           # Environment variables
├── vercel.json                          # Vercel configuration
└── STRIPE_WEBHOOK_SETUP.md             # This file
```

---

**Setup completed on:** 2025-10-12
**Stripe Dashboard:** https://dashboard.stripe.com/test/webhooks
**Webhook ID:** we_1SHHrEEG7Jir5vNmdZSebPId
