# 🚀 GemBooth Live Mode Deployment Guide

## ✅ Completed Steps

The following has been **successfully completed**:

1. ✅ **Stripe Products Created in LIVE MODE**
   - GemBooth Pro: `prod_TGLnfGmmEyBnEU`
   - GemBooth Premium: `prod_TGLnsnEoMFURqe`

2. ✅ **Stripe Prices Created**
   - Pro Monthly ($9.99 AUD): `price_1SJp5ZEG7Jir5vNmXcM7ARjA`
   - Pro Yearly ($99.99 AUD): `price_1SJp5ZEG7Jir5vNmOrXj1Fa6`
   - Premium Monthly ($19.99 AUD): `price_1SJp5aEG7Jir5vNm5g4i1LJA`
   - Premium Yearly ($199.99 AUD): `price_1SJp5aEG7Jir5vNmnVgXlpz1`

3. ✅ **SQL Update File Created**
   - File: `update-live-stripe-prices.sql`

4. ✅ **Live Environment Variables File Created**
   - File: `.env.local.live`

---

## 📋 Remaining Steps (Do These in Order)

### Step 1: Update Supabase Database

1. Go to https://supabase.com/dashboard/project/cahdabrkluflhlwexqsc/sql/new
2. Open the file: `update-live-stripe-prices.sql`
3. Copy the entire SQL content
4. Paste into Supabase SQL Editor
5. Click **RUN** button
6. Verify the output shows 3 rows (free, pro, premium) with the new price IDs

**Expected result:**
```
id      | name    | stripe_price_id_monthly          | stripe_price_id_yearly
--------|---------|----------------------------------|----------------------------------
free    | Free    | NULL                             | NULL
pro     | Pro     | price_1SJp5ZEG7Jir5vNmXcM7ARjA  | price_1SJp5ZEG7Jir5vNmOrXj1Fa6
premium | Premium | price_1SJp5aEG7Jir5vNm5g4i1LJA  | price_1SJp5aEG7Jir5vNmnVgXlpz1
```

---

### Step 2: Create Stripe Webhook (LIVE MODE)

**CRITICAL:** You need a new webhook endpoint for live mode (test webhooks don't work in live mode).

1. Go to https://dashboard.stripe.com
2. **Toggle to LIVE MODE** (top-right corner - ensure test mode is OFF)
3. Navigate to **Developers → Webhooks**
4. Click **Add endpoint**
5. Enter webhook URL:
   ```
   https://cahdabrkluflhlwexqsc.supabase.co/functions/v1/stripe-webhook
   ```
6. Select these events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
7. Click **Add endpoint**
8. Copy the **Signing secret** (starts with `whsec_`)
9. Save this secret - you'll need it in the next step

---

### Step 3: Update Supabase Edge Function Secrets

Update the Stripe secrets in Supabase to use LIVE mode keys:

```bash
# Set LIVE Stripe secret key
SUPABASE_ACCESS_TOKEN=sbp_3b91e77eeb007e76192bc389bf8fc2d1cf4982d9 npx supabase@latest secrets set STRIPE_SECRET_KEY=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

# Set LIVE Stripe webhook secret (use the one from Step 2)
SUPABASE_ACCESS_TOKEN=sbp_3b91e77eeb007e76192bc389bf8fc2d1cf4982d9 npx supabase@latest secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET

# Verify the secrets were set
SUPABASE_ACCESS_TOKEN=sbp_3b91e77eeb007e76192bc389bf8fc2d1cf4982d9 npx supabase@latest secrets list
```

**IMPORTANT:** Edge Functions cache secrets, so you need to redeploy them after updating:

```bash
# Redeploy Stripe-related Edge Functions
SUPABASE_ACCESS_TOKEN=sbp_3b91e77eeb007e76192bc389bf8fc2d1cf4982d9 npx supabase@latest functions deploy create-checkout-session --no-verify-jwt

SUPABASE_ACCESS_TOKEN=sbp_3b91e77eeb007e76192bc389bf8fc2d1cf4982d9 npx supabase@latest functions deploy create-portal-session --no-verify-jwt

SUPABASE_ACCESS_TOKEN=sbp_3b91e77eeb007e76192bc389bf8fc2d1cf4982d9 npx supabase@latest functions deploy stripe-webhook --no-verify-jwt
```

---

### Step 4: Update Local Environment Variables

1. **Backup your current .env.local:**
   ```bash
   copy .env.local .env.local.backup
   ```

2. **Replace .env.local with the live version:**
   ```bash
   copy .env.local.live .env.local
   ```

3. **Edit .env.local** and replace `whsec_REPLACE_WITH_LIVE_WEBHOOK_SECRET_AFTER_CREATING_WEBHOOK` with the actual webhook secret from Step 2

4. **Restart your dev server** to pick up the new environment variables:
   ```bash
   npm run dev
   ```

---

### Step 5: Update Vercel Production Environment Variables

If you've already deployed to Vercel, update the production environment variables:

1. Go to https://vercel.com/your-username/gembooth/settings/environment-variables
2. Update or add these variables for **Production** environment:
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_51RpZ0mEG7Jir5vNmhMvGfIUT72zSqCJSvtDO9uPWwI4nnlPQtUZ8TAx3jzik8o7TwnRE189EcLNlDirwV0smdaWp00Yi4Ynu6N`
   - `STRIPE_SECRET_KEY` = `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`
   - `STRIPE_WEBHOOK_SECRET` = `whsec_YOUR_LIVE_WEBHOOK_SECRET` (from Step 2)
3. Click **Save**
4. Redeploy your app:
   ```bash
   npx vercel --prod
   ```

---

### Step 6: Configure Stripe Customer Portal (LIVE MODE)

Enable customers to manage their subscriptions:

1. Go to https://dashboard.stripe.com/settings/billing/portal
2. **Ensure you're in LIVE MODE** (toggle in top-right)
3. Click **Activate customer portal** (if not already activated)
4. Configure settings:
   - ✅ Enable "Customers can update payment methods"
   - ✅ Enable "Customers can cancel subscriptions"
   - ✅ Enable "Customers can switch plans"
5. In **Subscriptions** section, click **Add products**:
   - Add: GemBooth Pro (`prod_TGLnfGmmEyBnEU`)
   - Add: GemBooth Premium (`prod_TGLnsnEoMFURqe`)
6. Click **Save changes**

---

### Step 7: Test the Live Integration

**IMPORTANT:** You'll be using real payment methods in live mode. Use your own card for testing.

#### Test Checkout Flow:
1. Visit your deployed site: https://gembooth.vercel.app/pricing
2. Click **Upgrade Now** on Pro or Premium
3. Enter real payment details (this will charge your card)
4. Complete checkout
5. Verify you're redirected to success page
6. Check Stripe Dashboard → Customers to see the new customer
7. Check Stripe Dashboard → Subscriptions to see the active subscription

#### Test Subscription Management:
1. Login to your app
2. Navigate to `/subscription` page
3. Click **Manage Subscription**
4. Verify Stripe Customer Portal opens
5. Test switching between plans
6. Test updating payment method
7. Verify changes reflect in your app

#### Test Webhook:
1. After completing a checkout, go to Stripe Dashboard → Developers → Webhooks
2. Click on your live webhook endpoint
3. Check the **Events** tab
4. Verify `checkout.session.completed` event was delivered successfully
5. Check Supabase Edge Function logs:
   ```bash
   SUPABASE_ACCESS_TOKEN=sbp_3b91e77eeb007e76192bc389bf8fc2d1cf4982d9 npx supabase@latest functions logs stripe-webhook
   ```
6. Verify your subscription status updated in database:
   - Go to Supabase Dashboard → Table Editor → `subscriptions`
   - Find your user's subscription
   - Verify `status` is `active` and `tier_id` is `pro` or `premium`

---

## 🎯 Quick Reference

### Live Stripe Price IDs
```javascript
// Pro Monthly: price_1SJp5ZEG7Jir5vNmXcM7ARjA ($9.99 AUD)
// Pro Yearly: price_1SJp5ZEG7Jir5vNmOrXj1Fa6 ($99.99 AUD)
// Premium Monthly: price_1SJp5aEG7Jir5vNm5g4i1LJA ($19.99 AUD)
// Premium Yearly: price_1SJp5aEG7Jir5vNmnVgXlpz1 ($199.99 AUD)
```

### Live API Keys
```
Publishable: pk_live_51RpZ0mEG7Jir5vNmhMvGfIUT72zSqCJSvtDO9uPWwI4nnlPQtUZ8TAx3jzik8o7TwnRE189EcLNlDirwV0smdaWp00Yi4Ynu6N
Secret: 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
```

### Webhook URL
```
https://cahdabrkluflhlwexqsc.supabase.co/functions/v1/stripe-webhook
```

---

## ⚠️ Important Notes

1. **Real Charges:** Live mode uses real payment methods and creates real charges. Test carefully!

2. **Webhook Secret:** Test mode and live mode have different webhook secrets. Make sure to use the correct one.

3. **Customer Portal:** Products must be added to the portal in live mode separately from test mode.

4. **Reverting to Test Mode:** If you need to go back to test mode, uncomment the test keys in `.env.local` and comment out the live keys.

5. **Subscription Cancellation:** Configure what happens when users cancel (immediate vs. end of period) in Stripe Dashboard → Settings → Billing → Subscriptions.

6. **Refunds:** Process refunds through Stripe Dashboard → Payments → [Select payment] → Refund.

---

## 🐛 Troubleshooting

### Checkout failing?
- Check browser console for errors
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` is the LIVE key (starts with `pk_live_`)
- Check Network tab for failed API calls

### Webhook not working?
- Verify webhook URL is correct
- Check webhook signing secret is set in Supabase: `supabase secrets list`
- View webhook delivery in Stripe Dashboard → Webhooks → [Your webhook] → Events
- Check Edge Function logs: `supabase functions logs stripe-webhook`

### Customer Portal not showing products?
- Ensure you're viewing Stripe Dashboard in LIVE mode (not test mode)
- Verify products were added to portal configuration
- Check that portal is activated for live mode

### Database not updating?
- Verify Edge Functions were redeployed after updating secrets
- Check Supabase RLS policies allow updates for authenticated users
- Verify `subscriptions` table has INSERT and UPDATE policies

---

## 📞 Support

If you encounter issues:
1. Check Stripe Dashboard → Events for webhook delivery status
2. Check Supabase → Edge Functions → Logs for function errors
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly
5. Ensure you're in LIVE mode in Stripe Dashboard when testing

---

**🎉 You're ready to go live! Good luck with your launch!**
