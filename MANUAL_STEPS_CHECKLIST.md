# 📋 Manual Steps Checklist - Complete Live Mode Setup

## ✅ Already Completed

- ✅ Products created in Stripe live mode
- ✅ Local .env.local updated with live keys

---

## 🔴 Step 1: Update Database (5 minutes)

### What to do:
1. Open: https://supabase.com/dashboard/project/cahdabrkluflhlwexqsc/sql/new
2. Login to Supabase if needed
3. Copy the SQL below and paste into the SQL Editor
4. Click **RUN** button

### SQL to run:
```sql
-- Update GemBooth Pro with LIVE price IDs
UPDATE subscription_tiers
SET stripe_price_id_monthly = 'price_1SJp5ZEG7Jir5vNmXcM7ARjA',
    stripe_price_id_yearly = 'price_1SJp5ZEG7Jir5vNmOrXj1Fa6'
WHERE id = 'pro';

-- Update GemBooth Premium with LIVE price IDs
UPDATE subscription_tiers
SET stripe_price_id_monthly = 'price_1SJp5aEG7Jir5vNm5g4i1LJA',
    stripe_price_id_yearly = 'price_1SJp5aEG7Jir5vNmnVgXlpz1'
WHERE id = 'premium';

-- Verify the updates
SELECT
  id,
  name,
  price_monthly,
  price_yearly,
  stripe_price_id_monthly,
  stripe_price_id_yearly
FROM subscription_tiers
ORDER BY price_monthly;
```

### Expected result:
You should see 3 rows with the new price IDs for pro and premium.

---

## 🔴 Step 2: Create Stripe Webhook (3 minutes)

### What to do:
1. Open: https://dashboard.stripe.com/webhooks
2. **CRITICAL:** Toggle to **LIVE MODE** in top-right corner (ensure test mode is OFF)
3. Click **Add endpoint** button
4. Enter the following details:

**Endpoint URL:**
```
https://cahdabrkluflhlwexqsc.supabase.co/functions/v1/stripe-webhook
```

**Events to send:**
Select these 5 events:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

5. Click **Add endpoint**
6. On the next page, click **Reveal** under "Signing secret"
7. **COPY the webhook secret** (starts with `whsec_`)
8. Save it somewhere - you'll need it in the next steps!

---

## 🔴 Step 3: Update .env.local with Webhook Secret (1 minute)

### What to do:
1. Open: `C:\Users\jamie\Desktop\gembooth\.env.local`
2. Find line 14: `STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_LIVE_WEBHOOK_SECRET_AFTER_CREATING_WEBHOOK`
3. Replace `whsec_REPLACE_WITH_LIVE_WEBHOOK_SECRET_AFTER_CREATING_WEBHOOK` with your actual webhook secret from Step 2
4. Save the file

**Example:**
```env
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz789...
```

---

## 🔴 Step 4: Update Supabase Secrets & Redeploy (5 minutes)

### Option A: Run the Batch Script (Easiest)

1. Double-click: `C:\Users\jamie\Desktop\gembooth\complete-live-setup.bat`
2. Follow the prompts
3. When asked for webhook secret, paste the one from Step 2

### Option B: Manual Commands

Open Command Prompt or PowerShell in `C:\Users\jamie\Desktop\gembooth` and run:

```bash
# Login to Supabase
npx supabase@latest login

# Link to your project
npx supabase@latest link --project-ref cahdabrkluflhlwexqsc

# Set Stripe secret key
npx supabase@latest secrets set STRIPE_SECRET_KEY=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

# Set webhook secret (replace YOUR_WEBHOOK_SECRET)
npx supabase@latest secrets set STRIPE_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

# Verify secrets were set
npx supabase@latest secrets list

# Redeploy Edge Functions
npx supabase@latest functions deploy create-checkout-session --no-verify-jwt
npx supabase@latest functions deploy create-portal-session --no-verify-jwt
npx supabase@latest functions deploy stripe-webhook --no-verify-jwt
```

---

## 🔴 Step 5: Configure Stripe Customer Portal (3 minutes)

### What to do:
1. Open: https://dashboard.stripe.com/settings/billing/portal
2. **CRITICAL:** Ensure you're in **LIVE MODE** (toggle in top-right)
3. If portal is not activated, click **Activate customer portal**
4. Configure settings:
   - ✅ Enable "Customers can update payment methods"
   - ✅ Enable "Customers can cancel subscriptions"
   - ✅ Enable "Customers can switch plans"
5. Scroll to **Subscriptions** section
6. Click **Add products**
7. Add these two products:
   - GemBooth Pro
   - GemBooth Premium
8. Click **Save changes**

---

## 🎉 Step 6: Test Everything! (5 minutes)

### Test 1: Checkout Flow
1. Visit: https://gembooth.vercel.app/pricing (or http://localhost:5173/pricing if running locally)
2. Click **Upgrade Now** on Pro plan
3. **USE A REAL CARD** - you will be charged!
4. Complete the checkout
5. Verify you're redirected to success page

### Test 2: Verify Webhook
1. Go to: https://dashboard.stripe.com/webhooks
2. Click on your webhook endpoint
3. Click the **Events** tab
4. You should see `checkout.session.completed` event with ✅ green checkmark

### Test 3: Check Database
1. Go to: https://supabase.com/dashboard/project/cahdabrkluflhlwexqsc/editor/subscriptions
2. Find your user's subscription
3. Verify:
   - `status` = `active`
   - `tier_id` = `pro` (or `premium`)
   - `stripe_subscription_id` is populated

### Test 4: Customer Portal
1. Login to your app
2. Navigate to `/subscription`
3. Click **Manage Subscription**
4. Verify Stripe Customer Portal opens
5. Test switching between plans
6. Test updating payment method

---

## 📊 Progress Tracker

Use this checklist to track your progress:

- [ ] Step 1: Database updated with live price IDs
- [ ] Step 2: Stripe webhook created and secret saved
- [ ] Step 3: .env.local updated with webhook secret
- [ ] Step 4: Supabase secrets updated & functions redeployed
- [ ] Step 5: Customer Portal configured with products
- [ ] Step 6: All tests passed

---

## 🐛 Troubleshooting

### Webhook not delivering?
- Check the webhook URL is correct
- Verify it's pointing to the LIVE endpoint
- Check event types are selected correctly

### Checkout failing?
- Check browser console for errors
- Verify .env.local has live publishable key
- Ensure products are active in Stripe

### Database not updating?
- Check Edge Function logs in Supabase
- Verify webhook secret matches in Supabase and Stripe
- Check RLS policies allow updates

---

## 🎯 Quick Reference

### Live Price IDs
```
Pro Monthly:    price_1SJp5ZEG7Jir5vNmXcM7ARjA ($9.99 AUD)
Pro Yearly:     price_1SJp5ZEG7Jir5vNmOrXj1Fa6 ($99.99 AUD)
Premium Monthly: price_1SJp5aEG7Jir5vNm5g4i1LJA ($19.99 AUD)
Premium Yearly:  price_1SJp5aEG7Jir5vNmnVgXlpz1 ($199.99 AUD)
```

### Webhook URL
```
https://cahdabrkluflhlwexqsc.supabase.co/functions/v1/stripe-webhook
```

### Important Links
- Stripe Dashboard: https://dashboard.stripe.com
- Supabase Dashboard: https://supabase.com/dashboard/project/cahdabrkluflhlwexqsc
- SQL Editor: https://supabase.com/dashboard/project/cahdabrkluflhlwexqsc/sql/new
- Edge Function Logs: https://supabase.com/dashboard/project/cahdabrkluflhlwexqsc/logs/edge-functions

---

**🚀 You're almost there! Follow these steps carefully and you'll be live in about 20 minutes!**
