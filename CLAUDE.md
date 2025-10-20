# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GemBooth is an AI-powered photo booth application that uses Google's Gemini API to transform photos with various artistic effects. Built with React + Vite, it features user authentication, cloud storage, and optional Stripe-based monetization.

**Tech Stack:**
- Frontend: React 18 + Vite
- Backend: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- AI: Google Gemini 2.5 Flash Image Preview
- Payments: Stripe (optional)
- State: Zustand with Immer
- Deployment: Vercel (frontend) + Supabase (backend)

## Essential Commands

### Development
```bash
npm run dev          # Start dev server on http://localhost:5173
npm run build        # Production build
npm run preview      # Preview production build
```

### Supabase
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push                    # Apply migrations to database
supabase functions deploy           # Deploy all Edge Functions
supabase functions deploy process-image    # Deploy specific function
supabase functions logs process-image      # View function logs
supabase secrets set GEMINI_API_KEY=xxx    # Set environment secret
supabase secrets list               # List all secrets
```

### Deployment
```bash
vercel              # Deploy to Vercel preview
vercel --prod       # Deploy to production
```

## Architecture

### State Management
The app uses **Zustand** with **Immer** middleware for state management:
- `src/lib/store.js` - Central state store with Zustand
- State includes: photos array, active mode, GIF progress, custom prompts
- Actions are defined in `src/lib/actions.js` and `src/lib/actions-supabase.js`
- Use `useStore.use.photos()` pattern via auto-zustand-selectors-hook

### Data Flow

**Photo Processing:**
1. User takes photo via webcam → `snapPhoto()` in actions
2. Photo uploaded to Supabase Storage (if auth enabled)
3. Edge Function `process-image` calls Gemini API with prompt
4. Processed image stored in Supabase Storage
5. Metadata saved to `photos` table
6. Image data cached locally in `imageData` object

**GIF Creation:**
1. User clicks "Make GIF" → `makeGif()`
2. Combines input/output photos using `gifenc` library
3. Canvas processing resizes images to 512x512
4. Alternates between input (333ms) and output (833ms) frames
5. Uploads finished GIF to Supabase Storage

**AI Image Generation:**
1. User enters text prompt → navigates to `/generate`
2. Optional: Gemini Flash API enhances prompt with vivid details
3. Client-side Canvas API generates placeholder images (512x512)
4. Images uploaded to Supabase Storage bucket `user-photos`
5. Metadata saved to `generated_images` table
6. Images displayed in Gallery's "Generated" tab

### File Structure

```
src/
├── components/
│   ├── App.jsx                    # Main photo booth UI (local mode)
│   ├── AppWithAuth.jsx            # Wrapper with auth routing
│   ├── Auth/                      # Authentication components
│   │   ├── AuthContext.jsx        # Auth state provider
│   │   ├── LoginForm.jsx
│   │   └── SignupForm.jsx
│   ├── ImageGeneration.jsx        # AI image generation page
│   ├── Gallery.jsx                # View photos, GIFs, and generated images
│   ├── PricingPage.jsx            # Stripe pricing UI
│   ├── SubscriptionManager.jsx    # User subscription management
│   └── UsageLimitBanner.jsx       # Usage tracking display
├── contexts/
│   └── AuthContext.jsx            # Shared auth context
├── lib/
│   ├── store.js                   # Zustand state store
│   ├── actions.js                 # Core business logic (local mode)
│   ├── actions-supabase.js        # Supabase-integrated actions
│   ├── modes.js                   # AI transformation modes (Renaissance, Cartoon, etc.)
│   ├── llm.js                     # Gemini API client
│   ├── imageData.js               # In-memory image cache
│   ├── supabase/
│   │   ├── client.js              # Supabase client setup
│   │   └── auth.js                # Auth service
│   └── stripe/
│       ├── config.js              # Stripe configuration
│       └── subscriptionService.js # Subscription helpers

supabase/
├── migrations/                     # Database schema versions
│   ├── 20250106000000_initial_schema.sql      # Tables: profiles, photos, gifs, etc.
│   ├── 20250106000001_rls_policies.sql        # Row Level Security
│   ├── 20250106000002_storage_setup.sql       # Storage buckets
│   ├── 20250107000000_subscriptions_schema.sql # Stripe integration
│   ├── 20250118000000_add_generated_images.sql # AI image generation table
│   └── 20250118000001_generated_images_rls.sql # Generated images RLS
└── functions/                      # Supabase Edge Functions (Deno)
    ├── process-image/              # Calls Gemini API to transform images
    ├── create-gif/                 # Server-side GIF creation
    ├── create-checkout-session/    # Stripe checkout
    ├── create-portal-session/      # Stripe customer portal
    └── stripe-webhook/             # Handle Stripe events
```

### Database Schema

**Core Tables:**
- `profiles` - User profiles (username, avatar, bio)
- `photos` - Photo metadata (user_id, input_url, output_url, mode, prompt)
- `gifs` - Generated GIFs (user_id, gif_url, photo_ids array)
- `generated_images` - AI-generated images (user_id, image_url, prompt, is_public)
- `usage_stats` - Analytics (photos_created, gifs_created, storage_used)

**Monetization Tables (optional):**
- `subscription_tiers` - Tier definitions (free, pro, premium)
- `subscriptions` - User subscriptions (tier, stripe_subscription_id, status)
- `usage_limits` - Monthly limits (photos_limit, gifs_limit, current usage)
- `payments` - Payment history

**Security:**
- All tables use Row Level Security (RLS)
- Storage buckets: `user-photos` (10MB limit), `user-gifs` (50MB limit)
- RLS ensures users only access their own data

### AI Modes System

Defined in `src/lib/modes.js`:
- Each mode has: `name`, `emoji`, `prompt`
- Modes: Renaissance, Cartoon, Statue, Banana, 80s, 19th Century, Anime, Psychedelic, 8-bit, Big Beard, Comic Book, Old
- Custom mode allows user-defined prompts
- Prompts sent to Gemini 2.5 Flash Image Preview model

### AI Image Generation Feature

**Location:** `/generate` route (ImageGeneration.jsx)

**How It Works:**
1. **User Input**: Text prompt describing desired image + number of images (1-10)
2. **Prompt Enhancement** (optional): Gemini Flash API adds vivid details to prompt
3. **Image Creation**: HTML5 Canvas generates placeholder images with:
   - 512x512 resolution
   - 5 rotating gradient color schemes
   - Text-wrapped prompt overlay
   - "AI Generated Image" watermark
4. **Storage**: Images uploaded to Supabase Storage (`user-photos` bucket)
5. **Database**: Metadata saved to `generated_images` table with RLS policies
6. **Gallery Integration**: Automatically appears in Gallery's "Generated" tab

**API Key:** `AIzaSyBjosltDAxf1XQXoxO7ogY6BXO3UmD191A`
- Hardcoded in `ImageGeneration.jsx:6`
- Used for Gemini Flash prompt enhancement (optional)
- Falls back gracefully to placeholder images if API fails

**Database Table:**
```sql
CREATE TABLE generated_images (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  image_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Migrations:**
- `20250118000000_add_generated_images.sql` - Table creation
- `20250118000001_generated_images_rls.sql` - RLS policies

## Environment Variables

Required in `.env.local`:

```env
# Gemini API (get from https://ai.google.dev)
# Used by Edge Functions for photo transformation
GEMINI_API_KEY=your_key_here

# Image Generation API Key
# Currently: AIzaSyBjosltDAxf1XQXoxO7ogY6BXO3UmD191A
# Hardcoded in src/components/ImageGeneration.jsx (line 6)
# Used for prompt enhancement via Gemini Flash API

# Supabase (from Supabase Dashboard → Settings → API)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Stripe (optional, from https://dashboard.stripe.com)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Supabase Secrets** (set with `supabase secrets set`):
- `GEMINI_API_KEY` - Used by Edge Functions
- `STRIPE_SECRET_KEY` - Stripe API key (optional)
- `STRIPE_WEBHOOK_SECRET` - Webhook signing (optional)

## Key Patterns

### Adding New AI Modes

Edit `src/lib/modes.js`:
```javascript
export default {
  yourmode: {
    name: 'Display Name',
    emoji: '🎨',
    prompt: 'Detailed instruction for Gemini API...'
  }
}
```

### Working with Supabase Storage

Images are stored with user-scoped paths:
- Input: `{user_id}/inputs/{photo_id}.jpg`
- Output: `{user_id}/outputs/{photo_id}.jpg`
- GIFs: `{user_id}/gifs/{gif_id}.gif`
- Generated: `{user_id}/{image_id}.jpg`

Upload pattern:
```javascript
const { data, error } = await supabase.storage
  .from('user-photos')
  .upload(`${userId}/outputs/${photoId}.jpg`, blob)
```

### Edge Function Pattern

All Edge Functions follow this structure:
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Your logic here
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
```

## Common Tasks

### Adding a New Table

1. Create migration: `supabase migration new your_table_name`
2. Write SQL in `supabase/migrations/YYYYMMDDHHMMSS_your_table_name.sql`
3. Add RLS policies in the migration
4. Apply: `supabase db push`

### Deploying Edge Function Changes

```bash
# Edit function in supabase/functions/your-function/
supabase functions deploy your-function
supabase functions logs your-function  # Check for errors
```

### Testing Stripe Integration

Use test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry, any CVC, any ZIP

### Debugging Photo Processing

1. Check browser console for client errors
2. Check Edge Function logs: `supabase functions logs process-image`
3. Verify GEMINI_API_KEY is set: `supabase secrets list`
4. Test Gemini API directly at https://ai.google.dev

## Recent Development Progress

### Stripe Checkout & Webhook Integration (January 2025)

**Status: ✅ COMPLETE - Checkout working, webhook configured**

Successfully fixed and deployed the complete Stripe subscription flow. Users can now upgrade to Pro ($9.99/month) and Premium ($19.99/month) plans.

#### Issues Fixed:

1. **Deno Runtime Compatibility**
   - Problem: `Deno.core.runMicrotasks()` error from outdated Stripe library
   - Solution: Updated from `'https://esm.sh/stripe@14.11.0?target=deno'` to `'npm:stripe@^17.0.0'`
   - Updated Stripe API version to `'2024-11-20.acacia'`
   - Files: `create-checkout-session/index.ts`, `stripe-webhook/index.ts`

2. **Authentication Issues**
   - Problem: "Not authenticated" error - Edge Function couldn't verify JWT
   - Solution: Extract token and pass directly to `getUser()`: `await supabase.auth.getUser(token)`
   - Added explicit Authorization header in frontend: `headers: { Authorization: 'Bearer ${session.access_token}' }`
   - File: `create-checkout-session/index.ts:42-46`, `subscriptionService.js:93-95`

3. **Stripe Secret Key Mismatch**
   - Problem: Outdated STRIPE_SECRET_KEY in Supabase Edge Function secrets
   - Solution: Deleted old secret, added current key from `.env.local`
   - Redeployed Edge Functions to pick up new secret (Edge Functions cache secrets)

4. **Database Configuration**
   - Problem: Missing Stripe price IDs in `subscription_tiers` table
   - Solution: Added monthly price IDs via SQL:
     - Pro: `price_1SHDB2EG7Jir5vNmHxHOweVa` ($9.99 AUD)
     - Premium: `price_1SHDCKEG7Jir5vNmgLa26cq9` ($19.99 AUD)

5. **Deprecated Stripe API**
   - Problem: `stripe.redirectToCheckout()` no longer supported
   - Solution: Direct URL redirect: `window.location.href = data.session.url`
   - File: `subscriptionService.js:108`

6. **React Router + Vercel**
   - Problem: Pricing page showing 404
   - Solution: Added rewrite rule in `vercel.json`: `{"source": "/(.*)", "destination": "/index.html"}`

#### Configuration Details:

**Edge Function Secrets** (Supabase Dashboard → Settings → Edge Function Secrets):
```
GEMINI_API_KEY=<your-key>
STRIPE_SECRET_KEY=sk_test_51RpZ0mEG7Jir5vNm...
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe webhook endpoint)
```

**Stripe Webhook Configuration**:
- Endpoint URL: `https://cahdabrkluflhlwexqsc.supabase.co/functions/v1/stripe-webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
- Configured at: https://dashboard.stripe.com/test/webhooks

**Database Price Configuration**:
```sql
-- Pro tier
UPDATE subscription_tiers
SET stripe_price_id_monthly = 'price_1SHDB2EG7Jir5vNmHxHOweVa'
WHERE id = 'pro';

-- Premium tier
UPDATE subscription_tiers
SET stripe_price_id_monthly = 'price_1SHDCKEG7Jir5vNmgLa26cq9'
WHERE id = 'premium';
```

#### Key Files Modified:

- `supabase/functions/create-checkout-session/index.ts` - Fixed auth, updated Stripe library
- `supabase/functions/stripe-webhook/index.ts` - Updated Stripe library, handles subscription events
- `src/lib/stripe/subscriptionService.js` - Fixed redirect method, added auth headers
- `vercel.json` - Added SPA rewrite rule

#### Testing:

**Test Card:** 4242 4242 4242 4242 (any future expiry, any CVC/ZIP)

**Checkout Flow:**
1. Visit: https://gembooth.vercel.app/pricing
2. Click "Upgrade Now" on Pro or Premium
3. Redirects to Stripe Checkout
4. Complete payment
5. Redirects to success page
6. Webhook updates subscription in database

**Verification:**
- Check logs: https://supabase.com/dashboard/project/cahdabrkluflhlwexqsc/logs/edge-functions
- Check webhook delivery: https://dashboard.stripe.com/test/webhooks
- Verify subscription in "My Subscription" page

### Subscription Portal Fix (January 2025)

**Status: ✅ COMPLETE - Portal fully functional**

Fixed the "Manage Subscription" button which was failing with "Failed to open subscription management portal" error. The complete fix involved updating the Edge Function, adding RLS policies, and properly configuring the Stripe Customer Portal.

#### Issues Fixed:

1. **Outdated Stripe Library**
   - Updated `create-portal-session/index.ts` from `stripe@14.11.0` to `npm:stripe@^17.0.0`
   - Updated Stripe API version to `'2024-11-20.acacia'`

2. **Missing Authentication**
   - Added Authorization header extraction and JWT token validation
   - Configured Supabase client with auth headers for RLS:
   ```typescript
   const supabase = createClient(
     Deno.env.get('SUPABASE_URL') ?? '',
     Deno.env.get('SUPABASE_ANON_KEY') ?? '',
     {
       global: {
         headers: { Authorization: authHeader },
       },
     }
   )
   ```

3. **Missing RLS Policies**
   - Added INSERT and UPDATE policies for subscriptions table
   - Applied via migration: `add_subscription_rls_policies`
   ```sql
   CREATE POLICY "Users can insert their own subscription"
   ON subscriptions FOR INSERT TO public
   WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own subscription"
   ON subscriptions FOR UPDATE TO public
   USING (auth.uid() = user_id)
   WITH CHECK (auth.uid() = user_id);
   ```

4. **Database Query**
   - Changed from `.single()` to `.maybeSingle()` to prevent 406 errors
   - Handles both existing and new subscription records gracefully

5. **Stripe Customer Portal Not Configured**
   - Manually activated Customer Portal in Stripe Dashboard
   - Added Pro and Premium products to portal subscription settings
   - **Critical Discovery:** Must view Stripe Dashboard in **test mode** to see test products

#### Stripe Customer Portal Configuration:

**Location:** https://dashboard.stripe.com/test/settings/billing/portal

**Required Steps:**
1. **Activate Portal** - Click "Activate customer portal" button
2. **Configure Settings:**
   - ✅ Enable "Customers can update payment methods"
   - ✅ Enable "Customers can cancel subscriptions"
   - ✅ Enable "Customers can switch plans"
3. **Add Products:**
   - Switch Stripe Dashboard to **test mode** (critical!)
   - In Subscriptions section, add products:
     - Pro Plan (`price_1SHDB2EG7Jir5vNmHxHOweVa`)
     - Premium Plan (`price_1SHDCKEG7Jir5vNmgLa26cq9`)
4. **Save Changes**

**IMPORTANT:** Test products only appear in Stripe Dashboard when in test mode. If products aren't showing up in the portal configuration, verify you're in test mode (toggle in top-right corner).

#### Files Modified:

- `supabase/functions/create-portal-session/index.ts` - Updated Stripe lib, auth, DB query, error handling
- `src/lib/stripe/subscriptionService.js` - Added auth headers, improved error handling
- Database migration: `add_subscription_rls_policies` - Added INSERT/UPDATE RLS policies

#### Testing Portal:

1. Login as user with active subscription
2. Navigate to `/subscription` page
3. Click "Manage Subscription" button
4. Verify Stripe Customer Portal opens and shows:
   - Current subscription (Free/Pro/Premium)
   - Option to switch between plans
   - Payment method management
   - Billing history
   - Cancel/resume subscription

#### Portal Features Available to Customers:

- **Upgrade/Downgrade** - Switch between Free, Pro, and Premium plans
- **Payment Methods** - Update credit card information
- **Billing History** - View past invoices and receipts
- **Cancel Subscription** - Self-service cancellation (configured to happen at period end)
- **Resume Subscription** - Reactivate before period end

See `PORTAL_FIX_GUIDE.md` for complete technical details.

### Stripe LIVE Mode Production Setup (October 2025)

**Status: ✅ COMPLETE - Live payments working in production**

Successfully configured and deployed Stripe LIVE mode for real payment processing. The checkout and subscription flows are fully functional with real credit cards.

#### Critical Configuration Requirements

**⚠️ MOST IMPORTANT:** All three locations MUST use matching Stripe keys from the SAME account:

1. **Database Price IDs** (`subscription_tiers` table)
2. **Supabase Edge Function Secrets**
3. **Vercel Environment Variables** (frontend)

If ANY of these three locations use keys from different Stripe accounts, checkout will fail with **"Edge Function returned a non-2xx status code"** error.

#### Current LIVE Configuration

**Stripe Account:** Ending in `...egbHNMaT`

**Database (subscription_tiers table):**
```sql
-- Pro tier (AUD $9.99/month)
stripe_price_id_monthly: price_1SJp5ZEG7Jir5vNmXcM7ARjA
stripe_price_id_yearly: price_1SJp5ZEG7Jir5vNmOrXj1Fa6

-- Premium tier (AUD $19.99/month)
stripe_price_id_monthly: price_1SJp5aEG7Jir5vNm5g4i1LJA
stripe_price_id_yearly: price_1SJp5aEG7Jir5vNmnVgXlpz1
```

**Supabase Edge Function Secrets:**
```
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_xo9taTe3DoroZFxpCqLHDG4PyUIjEiYv
```

**Vercel Environment Variables:**
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51RpZ0mEG7Jir5vNmhMvGfIUT72zSqCJSvtDO9uPWwI4nnlPQtUZ8TAx3jzik8o7TwnRE189EcLNlDirwV0smdaWp00Yi4Ynu6N
```

**Stripe Webhook Endpoint (LIVE mode):**
- URL: `https://cahdabrkluflhlwexqsc.supabase.co/functions/v1/stripe-webhook`
- Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
- Signing Secret: `whsec_xo9taTe3DoroZFxpCqLHDG4PyUIjEiYv`

#### Deployment Procedure

When updating Stripe keys, you MUST follow ALL these steps in order:

```bash
# 1. Update Supabase Edge Function Secrets
set SUPABASE_ACCESS_TOKEN=sbp_dc3c026c3c29d4172e78a4a1addd2494b557475c
npx supabase secrets set STRIPE_SECRET_KEY=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 --project-ref cahdabrkluflhlwexqsc
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xo9taTe3DoroZFxpCqLHDG4PyUIjEiYv --project-ref cahdabrkluflhlwexqsc

# 2. Redeploy ALL Edge Functions (they cache secrets!)
npx supabase functions deploy --project-ref cahdabrkluflhlwexqsc

# 3. Update Vercel environment variables via Dashboard
# Go to: https://vercel.com/[your-project]/settings/environment-variables
# Update VITE_STRIPE_PUBLISHABLE_KEY to pk_live_...

# 4. Redeploy frontend
vercel --prod
```

**🚨 CRITICAL:** Edge Functions cache their secrets at deployment time. Simply updating secrets in Supabase Dashboard does NOT update running functions. You MUST redeploy after changing secrets!

#### Common Errors and Solutions

**Error: "Edge Function returned a non-2xx status code" (400)**

**Root Cause:** Mismatched Stripe keys across the three configuration locations.

**Debugging Steps:**
1. Check Supabase Edge Function Secrets:
   - Go to: Supabase Dashboard → Settings → Edge Function Secrets
   - Click eye icon to view last characters of `STRIPE_SECRET_KEY`
   - Verify it matches the account that owns the price IDs in database

2. Verify database price IDs match the Stripe account:
   ```sql
   SELECT id, stripe_price_id_monthly FROM subscription_tiers WHERE id IN ('pro', 'premium');
   ```

3. Check which Stripe account owns these prices:
   - Log into Stripe Dashboard → Products
   - Search for the price IDs
   - Note which account shows the prices

4. Ensure all three locations use keys from the SAME account:
   - Database prices → from Account X
   - Supabase secrets → must be Account X keys
   - Vercel env vars → must be Account X publishable key

**Error: "Invalid price ID"**

**Root Cause:** Price IDs in database belong to TEST mode, but you're using LIVE keys (or vice versa).

**Solution:** Ensure price IDs have the correct prefix:
- TEST mode prices: Start with `price_...` from test mode dashboard
- LIVE mode prices: Start with `price_...` from live mode dashboard
- Must create products/prices in the SAME mode as your API keys

#### Testing in Production

**⚠️ WARNING:** Live mode charges REAL credit cards!

**Test Procedure:**
1. Visit production URL: https://gembooth-7wghhotsa-jamie-lees-projects-f8b674ea.vercel.app/pricing
2. Log in with a test user account
3. Click "Upgrade Now" on Pro plan
4. Use a REAL credit card (will be charged!)
5. Complete checkout
6. Verify:
   - Redirects to success page
   - Webhook appears in Stripe Dashboard
   - Database updated with subscription
   - User can access Pro features

**Stripe Dashboard Verification:**
- Payments: https://dashboard.stripe.com/payments
- Webhooks: https://dashboard.stripe.com/webhooks
- Customers: https://dashboard.stripe.com/customers

#### Files Reference

- **Live keys stored in:** `.env.local.live` (backup reference)
- **Active keys in:** `.env.local` (local development)
- **Production keys in:** Vercel Dashboard environment variables
- **Backend keys in:** Supabase Dashboard Edge Function Secrets

### FitCheck Virtual Try-On UI/UX Redesign (October 2025)

**Status: ✅ COMPLETE - Professional interface redesign**

Completely transformed the FitCheck page from a sloppy layout to a beautifully structured, professional interface matching the Gembooth design system.

#### Major Improvements

**1. Main Layout Structure** (`FitCheckApp.jsx`)
- Added sticky page header with gradient title and dynamic subtitle
- Reorganized into proper grid layout: canvas (left) + sidebar (right)
- Canvas section wrapped in frosted glass container with proper spacing
- Sidebar is sticky on desktop, transforms to collapsible bottom sheet on mobile
- Improved visual hierarchy with clear section separation
- Better error display with icons and styled containers

**2. Start Screen Redesign** (`StartScreen.jsx`)
- Professional two-column layout:
  - **Left**: Hero content with badge, heading, description, upload button
  - **Right**: Interactive demo with before/after comparison slider
- Added "✨ AI-Powered Virtual Try-On" badge for visual interest
- Large, bold typography for heading ("See Yourself in Any Outfit")
- Gradient purple upload button with hover effects and icon
- Visual hints with emojis for better UX (📸, 😊)
- Elegant gradient divider between sections
- Improved error display with icon and styled container
- Professional caption under demo ("Drag to see the transformation")

**3. Design System Consistency**
- Dark theme with solid black background (#000)
- Frosted glass aesthetic throughout (rgba backgrounds with backdrop-filter blur)
- Purple gradient accents (#667eea → #764ba2) for CTAs and highlights
- Proper spacing following 8px grid system
- Consistent border styling (rgba(255, 255, 255, 0.1))
- Professional shadows for depth and elevation
- Smooth transitions (0.2s-0.3s) for all interactive elements

**4. Responsive Design**
- Mobile-first approach with breakpoints at 768px and 1024px
- Sidebar transforms to collapsible bottom sheet on mobile/tablet
- Adjusted typography scales for smaller screens
- Touch-friendly button sizes (minimum 44px tap targets)
- Proper spacing adjustments for mobile views
- Grid collapses to single column on smaller screens

**5. Visual Polish**
- Custom scrollbars matching dark theme
- Professional button states (default, hover, active, disabled)
- Smooth animations with proper easing functions
- Loading overlays with backdrop blur
- Empty states with clear messaging
- Accessibility improvements with ARIA labels
- Focus states for keyboard navigation

#### Key CSS Classes

**Page Structure:**
- `.fitCheckPage` - Main container with black background
- `.fitCheckPageHeader` - Sticky header with gradient title
- `.fitCheckPageContent` - Main content area with proper padding
- `.fitCheckCenteredContainer` - Centered container for start screen
- `.fitCheckMainLayout` - Grid layout for canvas + sidebar

**Start Screen:**
- `.fitCheckStartScreen` - Two-column grid layout
- `.fitCheckStartLeft` / `.fitCheckStartRight` - Column containers
- `.fitCheckStartBadge` - Purple badge with border
- `.fitCheckStartHeading` - Large bold heading
- `.fitCheckUploadButton` - Gradient purple CTA button
- `.fitCheckStartHints` - Hint text container with emojis
- `.fitCheckCompareImage` - Demo image with rounded corners

**Layout Components:**
- `.fitCheckCanvasSection` - Canvas container with frosted glass
- `.fitCheckSidebarSection` - Sticky sidebar with frosted glass
- `.fitCheckSidebarContent` - Sidebar inner content with scroll
- `.fitCheckMobileToggle` - Mobile collapse/expand button

#### Files Modified

1. **FitCheckApp.jsx** - Complete layout restructure with new components
2. **StartScreen.jsx** - Professional hero section with two-column layout
3. **FitCheck.css** - Comprehensive styling update (~200 new lines)
   - New page structure styles
   - Start screen components
   - Responsive breakpoints
   - Animation improvements

#### Design Patterns Used

**Layout:**
- CSS Grid for main layout (desktop: 2 columns, mobile: 1 column)
- Flexbox for component internals
- Sticky positioning for header and sidebar
- Fixed positioning for mobile bottom sheet

**Visual Effects:**
- Gradient backgrounds for CTAs
- Backdrop blur for frosted glass effect
- Box shadows for depth (subtle to strong: 0-40px)
- Smooth transitions (0.2s-0.3s ease)
- Hover effects with transform and shadow changes

**Typography:**
- Heading: 3rem (desktop) → 2rem (mobile)
- Body: 1.125rem (desktop) → 1rem (mobile)
- Hint text: 0.875rem
- Disclaimer: 0.75rem

**Spacing:**
- Large gaps: 4rem (desktop) → 2rem (mobile)
- Medium gaps: 2rem → 1rem
- Small gaps: 1rem → 0.5rem
- Follows 8px grid system

#### Before & After

**Before:**
- Cluttered, unorganized layout
- Inconsistent spacing and alignment
- Poor visual hierarchy
- Generic, unstyled components
- No clear sections or structure
- Mobile layout broken

**After:**
- Clean, professional grid-based layout
- Consistent spacing following design system
- Clear visual hierarchy with sections
- Beautifully styled components with frosted glass aesthetic
- Proper responsive design with mobile bottom sheet
- Matches Gembooth's visual language

#### Testing

Visit the FitCheck page at `/fit-check` route to see the transformation. The page now provides:
- Professional first impression with hero section
- Intuitive navigation and layout
- Smooth, polished interactions
- Consistent branding with main app
- Excellent mobile experience

## Design System & Styling Guidelines

### Consistent Visual Language

All pages and new components should follow the **dark theme frosted glass aesthetic** for visual consistency across the app.

#### Background & Layout
- **Page Background**: Always use `background: #000` (solid black)
- **Top Padding**: Add `padding-top: 80px` (or `6rem`) to account for fixed navigation header
- **Min Height**: Use `min-height: 100vh` for full-page layouts

#### Frosted Glass Components
Use this pattern for cards, modals, toolbars, and container elements:

```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 12px; /* or 20px for larger containers */
```

**Hover states** (interactive elements):
```css
background: rgba(255, 255, 255, 0.08);
border-color: rgba(255, 255, 255, 0.2);
```

**Active/selected states**:
```css
background: rgba(255, 255, 255, 0.15);
border-color: rgba(255, 255, 255, 0.3);
```

#### Typography
- **Headers**: `color: #fff` (pure white)
- **Body Text**: `color: rgba(255, 255, 255, 0.9)` (slightly muted)
- **Secondary Text**: `color: rgba(255, 255, 255, 0.7)` (labels, captions)
- **Disabled Text**: `color: rgba(255, 255, 255, 0.4)`

#### Buttons & Controls

**Default Button**:
```css
background: rgba(255, 255, 255, 0.08);
border: 2px solid rgba(255, 255, 255, 0.2);
color: #fff;
border-radius: 8px;
transition: all 0.2s ease;
```

**Primary Button** (call-to-action):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
border: none;
border-radius: 8px;
```

**Danger Button**:
```css
color: #ff6b6b;
border-color: rgba(255, 107, 107, 0.3);
/* On hover */
background: rgba(255, 107, 107, 0.15);
```

#### Color Palette
- **Primary Purple Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Accent Blue**: `#667eea`
- **Success Green**: `#10b981`
- **Warning Orange**: `#f59e0b`
- **Error Red**: `#ff6b6b`

#### Tabs & Navigation
```css
/* Tab Container */
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);

/* Tab Button */
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.15);
color: rgba(255, 255, 255, 0.7);

/* Active Tab */
background: rgba(255, 255, 255, 0.15);
color: #fff;
border-bottom: 2px solid #667eea;
box-shadow: 0 -2px 10px rgba(102, 126, 234, 0.2);
```

#### Shadows & Elevation
- **Subtle**: `box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);`
- **Medium**: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);`
- **Strong**: `box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);`
- **Colored glow** (purple): `box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);`

#### Scrollbars
```css
scrollbar-width: thin;
scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

/* Webkit browsers */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
```

#### Example Page Template
```css
.newPage {
  min-height: 100vh;
  background: #000;
  padding: 6rem 2rem 2rem;
}

.pageContainer {
  max-width: 1200px;
  margin: 0 auto;
}

.pageCard {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
}
```

### Responsive Design
- Mobile breakpoint: `@media (max-width: 768px)`
- Tablet breakpoint: `@media (max-width: 1024px)`
- Always test on mobile - reduce padding/font sizes as needed

### Animation & Transitions
- Use `transition: all 0.2s ease` for hover states
- Use `transition: all 0.3s ease` for layout changes
- Keyframe animations for entrance effects (fade in, slide up)

**Example:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

## Important Implementation Notes

### Webcam Handling
- Canvas mirrors the video for selfie-style photos (flipped horizontally)
- Video stream captured at 1920x1080 ideal resolution
- Crops to center square before processing
- Uses `getUserMedia` with `facingMode: 'user'` for front camera

### GIF Encoding
- Uses `gifenc` library (imported from unpkg CDN)
- Fixed size: 512x512 pixels
- Frame timing: input (333ms) → output (833ms)
- Quantizes colors to 256-color palette per frame

### Authentication Flow
- Supabase Auth with email/password
- Session stored in localStorage
- `AuthContext` provides user state globally
- Protected routes check `user` before rendering
- New users automatically get 'free' subscription tier

### Image Caching Strategy
- `imageData` object stores base64 strings in memory
- Prevents re-downloading from storage on every render
- Cleared on page refresh (intentional for demo)
- Production: Consider IndexedDB for persistence

## Troubleshooting

### "Missing environment variables"
- Ensure `.env.local` exists (copy from `.env.example`)
- All Vite env vars must start with `VITE_`
- Restart dev server after changing `.env.local`

### Edge Function errors
- Check logs: `supabase functions logs function-name`
- Verify secrets are set: `supabase secrets list`
- Ensure CORS headers are included in responses

### Photos not saving to Supabase
- Verify user is authenticated
- Check RLS policies allow insert for auth.uid()
- Verify storage bucket exists and has proper policies
- Check Network tab for 403/401 errors

### Stripe webhooks not working
- Verify webhook URL points to Edge Function
- Check webhook secret is set: `supabase secrets list`
- View webhook delivery in Stripe Dashboard → Developers → Webhooks
- Check `stripe-webhook` function logs

### Stripe Customer Portal products not showing
- **Most common issue:** Stripe Dashboard is in **live mode** instead of **test mode**
- Toggle test mode in top-right corner of Stripe Dashboard
- Test products/prices only appear when viewing in test mode
- Verify you're using test price IDs (start with `price_` from test mode)
- Refresh the portal configuration page after switching modes

## Documentation

Key docs in this repo:
- `QUICK_START.md` - Get running in 15 minutes
- `PROJECT_SUMMARY.md` - Full feature overview
- `SUPABASE_SETUP.md` - Backend setup guide
- `MONETIZATION_SETUP.md` - Stripe integration guide
- `DEPLOYMENT.md` - Production deployment
- `ANDROID_SETUP.md` - Mobile app architecture

External resources:
- [Supabase Docs](https://supabase.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Vite Docs](https://vitejs.dev)
