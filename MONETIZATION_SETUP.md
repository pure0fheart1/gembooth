# GemBooth Monetization Setup Guide

This guide will help you set up the complete monetization system with Stripe integration.

## Overview

The monetization system includes:
- 3 subscription tiers (Free, Pro, Premium)
- Stripe payment processing
- Usage tracking and limits
- Subscription management
- Webhook handling for automatic updates

## Prerequisites

1. Supabase project with database access
2. Stripe account (https://stripe.com)
3. Node.js and npm installed

## Step 1: Set Up Stripe

### Create Stripe Account and Products

1. Go to https://dashboard.stripe.com and sign up/login
2. Switch to Test Mode (toggle in top right)
3. Create Products and Prices:

#### Pro Plan
- Navigate to Products → Create Product
- Name: "GemBooth Pro"
- Description: "Professional photo booth features"
- Create two prices:
  - Monthly: $9.99/month (recurring)
  - Yearly: $99.99/year (recurring)
- Copy the Price IDs (starts with `price_`)

#### Premium Plan
- Navigate to Products → Create Product
- Name: "GemBooth Premium"
- Description: "Unlimited creative power"
- Create two prices:
  - Monthly: $19.99/month (recurring)
  - Yearly: $199.99/year (recurring)
- Copy the Price IDs (starts with `price_`)

### Get API Keys

1. Go to Developers → API Keys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### Set Up Webhook

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/stripe-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

## Step 2: Update Environment Variables

### Local Development (.env.local)

```env
# Existing Supabase vars
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Supabase Edge Function Secrets

Run these commands to set the secrets for your Supabase functions:

```bash
# Set Stripe secret key
supabase secrets set STRIPE_SECRET_KEY=sk_test_...

# Set Stripe webhook secret
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# Verify secrets
supabase secrets list
```

## Step 3: Update Database Schema

### Run the migration

The subscription schema migration is already created at:
`supabase/migrations/20250107000000_subscriptions_schema.sql`

To apply it:

```bash
# If using Supabase CLI locally
supabase db reset

# OR push to production
supabase db push
```

### Update Stripe Price IDs in Database

After the migration runs, update the price IDs:

```sql
-- Update Pro tier price IDs
UPDATE subscription_tiers
SET stripe_price_id_monthly = 'price_YOUR_PRO_MONTHLY_ID',
    stripe_price_id_yearly = 'price_YOUR_PRO_YEARLY_ID'
WHERE id = 'pro';

-- Update Premium tier price IDs
UPDATE subscription_tiers
SET stripe_price_id_monthly = 'price_YOUR_PREMIUM_MONTHLY_ID',
    stripe_price_id_yearly = 'price_YOUR_PREMIUM_YEARLY_ID'
WHERE id = 'premium';
```

Run this in the Supabase SQL Editor.

## Step 4: Deploy Edge Functions

Deploy the Stripe-related edge functions:

```bash
# Deploy all functions
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
supabase functions deploy stripe-webhook

# OR deploy all at once
supabase functions deploy
```

## Step 5: Configure Row Level Security (RLS)

Add RLS policies for the new tables:

```sql
-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Usage limits
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage"
  ON usage_limits FOR SELECT
  USING (auth.uid() = user_id);

-- Subscription tiers (public read)
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subscription tiers"
  ON subscription_tiers FOR SELECT
  TO public
  USING (true);

-- Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);
```

## Step 6: Test the Integration

### Test Signup Flow
1. Sign up a new user
2. Verify they get a 'free' subscription automatically
3. Check the usage_limits table has an entry

### Test Upgrade Flow
1. Navigate to /pricing
2. Click "Upgrade Now" on Pro or Premium
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify subscription status updates in database

### Test Webhook
1. Make a test payment
2. Check Stripe Dashboard → Developers → Webhooks → Events
3. Verify webhook was delivered successfully
4. Check database for payment record

### Test Limits
1. As a free user, take 50 photos
2. Try to take the 51st - should show limit message
3. Upgrade to Pro
4. Verify limits increase

## Step 7: Production Deployment

### Switch to Live Mode
1. In Stripe Dashboard, toggle to Live Mode
2. Get new live API keys
3. Create products and prices again in live mode
4. Update environment variables with live keys

### Update Vercel/Production Env
```bash
# Set production environment variables
vercel env add VITE_STRIPE_PUBLISHABLE_KEY production
# Enter: pk_live_...

# Update Supabase secrets for production
supabase secrets set STRIPE_SECRET_KEY=sk_live_... --project-ref YOUR_PROJECT_REF
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_... --project-ref YOUR_PROJECT_REF
```

## Stripe Test Cards

Use these for testing:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Authentication Required: `4000 0025 0000 3155`

Use any future expiry date, any CVC, and any ZIP code.

## Subscription Tiers

### Free
- 50 photos per month
- 5 GIFs per month
- 100MB storage
- Watermarked downloads

### Pro ($9.99/month or $99.99/year)
- 500 photos per month
- 50 GIFs per month
- 5GB storage
- No watermarks
- HD downloads
- Priority processing

### Premium ($19.99/month or $199.99/year)
- Unlimited photos
- Unlimited GIFs
- 50GB storage
- Custom branding
- API access
- Priority support

## Troubleshooting

### Webhook Not Working
1. Check webhook URL is correct
2. Verify webhook secret is set in Supabase
3. Check function logs: `supabase functions logs stripe-webhook`

### Payment Not Completing
1. Check browser console for errors
2. Verify Stripe publishable key is correct
3. Check network tab for failed requests

### Usage Limits Not Updating
1. Verify RPC functions exist in database
2. Check that subscription was created on user signup
3. Verify usage_limits table has current period entry

## Support

For issues:
1. Check Stripe Dashboard → Events for webhook delivery
2. Check Supabase → Edge Functions → Logs
3. Check browser console for client errors
4. Check Stripe API Logs in dashboard

## Security Notes

- Never commit `.env.local` or expose secret keys
- Always use test mode for development
- Validate webhook signatures
- Use RLS policies to protect user data
- Keep Stripe.js library up to date
