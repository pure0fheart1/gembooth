# Quick Monetization Guide

## What's Included

✅ **3 Subscription Tiers**
- Free: 50 photos/month, 5 GIFs/month
- Pro: 500 photos/month, 50 GIFs/month - $9.99/mo or $99.99/yr
- Premium: Unlimited - $19.99/mo or $199.99/yr

✅ **Stripe Integration**
- Secure payment processing
- Subscription management
- Customer portal
- Webhook automation

✅ **Usage Tracking**
- Real-time usage monitoring
- Automatic limit enforcement
- Monthly reset system

✅ **UI Components**
- Pricing page with tier comparison
- Subscription management dashboard
- Usage limit banners
- Success/cancel pages

## Quick Setup (5 minutes)

### 1. Get Stripe Keys
```bash
# Go to https://dashboard.stripe.com (Test Mode)
# Copy: Publishable key (pk_test_...)
# Copy: Secret key (sk_test_...)
```

### 2. Set Environment Variables
```bash
# .env.local
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Supabase secrets
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
```

### 3. Create Stripe Products
- Create "GemBooth Pro" product with $9.99/mo and $99.99/yr prices
- Create "GemBooth Premium" product with $19.99/mo and $199.99/yr prices
- Copy the Price IDs

### 4. Update Database
```sql
UPDATE subscription_tiers
SET stripe_price_id_monthly = 'price_...',
    stripe_price_id_yearly = 'price_...'
WHERE id = 'pro';

UPDATE subscription_tiers
SET stripe_price_id_monthly = 'price_...',
    stripe_price_id_yearly = 'price_...'
WHERE id = 'premium';
```

### 5. Deploy Functions
```bash
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
supabase functions deploy stripe-webhook
```

### 6. Set Up Webhook
- Go to Stripe → Webhooks → Add endpoint
- URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
- Events: checkout.session.completed, customer.subscription.*, invoice.*
- Copy webhook secret and set: `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`

### 7. Test
- Visit /pricing
- Click "Upgrade Now"
- Use test card: 4242 4242 4242 4242
- Complete payment
- Check subscription status updates

## File Structure

```
src/
├── lib/
│   └── stripe/
│       ├── config.js              # Stripe configuration & tier definitions
│       └── subscriptionService.js # Subscription API functions
├── components/
│   ├── PricingPage.jsx           # Pricing page with tier cards
│   ├── PricingCards.jsx          # Pricing card component
│   ├── SubscriptionPage.jsx      # Subscription management page
│   ├── SubscriptionManager.jsx   # Subscription status & usage display
│   └── UsageLimitBanner.jsx      # Usage warning banner
supabase/
├── migrations/
│   └── 20250107000000_subscriptions_schema.sql
└── functions/
    ├── create-checkout-session/
    ├── create-portal-session/
    └── stripe-webhook/
```

## Key Features

### Usage Enforcement
```javascript
// Automatically checks limits before creating photos/GIFs
const canCreate = await checkUsageLimit(user.id, 'photo')
if (!canCreate) {
  // Show upgrade prompt
}
```

### Subscription Management
```javascript
// Users can manage subscriptions via Stripe portal
await createPortalSession(user.id)
// Opens Stripe customer portal
```

### Usage Tracking
```javascript
// Automatically incremented after successful creation
await incrementUsage(user.id, 'photo')
```

## Routes

- `/` - Main photo booth (requires auth)
- `/pricing` - View and compare plans
- `/subscription` - Manage current subscription
- `/subscription/success` - Post-checkout success page
- `/subscription/cancel` - Post-checkout cancel page

## Test Cards

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

Any future date, any CVC, any ZIP.

## Going Live

1. Switch Stripe to Live Mode
2. Create products/prices in Live Mode
3. Update env vars with `pk_live_...` and `sk_live_...`
4. Update webhook URL with live endpoint
5. Test with real card (start with small amount)

## Need Help?

See full documentation: `MONETIZATION_SETUP.md`
