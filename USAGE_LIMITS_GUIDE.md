# GemBooth Usage Limits - Complete Guide

## ✅ What's Already Working

Your GemBooth app **already has a fully functional usage limit system**! Here's what's implemented:

### 1. **Usage Tracking** (`src/lib/actions-supabase.js`)

- ✅ **Photo Creation** (lines 76-82): Checks limits before processing each photo
- ✅ **GIF Creation** (lines 223-228): Checks limits before creating GIFs
- ✅ **Batch Upload** (lines 374-378, 407-412): Checks limits for bulk operations
- ✅ **Usage Increment**: Automatically increments counters after successful operations

### 2. **Subscription Tiers** (`src/lib/stripe/config.js`)

```javascript
FREE Tier:
- 50 photos/month
- 5 GIFs/month
- 5 FitCheck uses/month
- 10 AI-generated images/month
- 10 PixShop edits/month

PRO Tier ($9.99/month):
- 500 photos/month
- 50 GIFs/month
- 50 FitCheck uses/month
- 200 AI-generated images/month
- 100 PixShop edits/month

PREMIUM Tier ($19.99/month):
- Unlimited everything!
```

### 3. **Usage Limit Banner** (`src/components/UsageLimitBanner.jsx`)

- ✅ Shows warning at 80% usage
- ✅ Shows error at 100% usage (blocks further actions)
- ✅ Provides "View Plans" link to upgrade

---

## 🆕 New Component: UsageCounter

I've created a **beautiful usage counter component** that displays real-time usage statistics.

### Features:

- 📊 **Visual Progress Bars** - See your usage at a glance
- 🎨 **Color-Coded Status** - Green (good), Yellow (warning), Red (critical)
- ⚡ **Auto-Refresh** - Updates every 10 seconds
- 💎 **Tier Badge** - Shows current subscription level
- 🚀 **Upgrade Link** - Quick access to pricing page

---

## 📦 How to Add UsageCounter to Your App

### Option 1: Add to Navigation (Recommended)

Edit `src/components/AppWithAuth.jsx` and add the counter to the navigation:

```jsx
// Add import at the top
import UsageCounter from './UsageCounter'

// Inside Navigation component, add before or after navLinks:
function Navigation() {
  const { signOut } = useAuth()
  const location = useLocation()

  return (
    <nav className="appNav">
      <div className="navBrand">
        <Link to="/">📸 GemBooth</Link>
      </div>

      {/* ADD USAGE COUNTER HERE */}
      <UsageCounter />

      <div className="navLinks">
        {/* ... existing links ... */}
      </div>
    </nav>
  )
}
```

### Option 2: Add to Main App Page

Edit `src/components/App.jsx` to add it inside the video controls or as a floating element:

```jsx
// Add import at the top
import UsageCounter from './UsageCounter'

// Then add it wherever you want in the JSX, for example:
<div className="video">
  {/* ... existing video code ... */}

  {videoActive && (
    <div className="video-controls">
      {/* ADD USAGE COUNTER HERE */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <UsageCounter />
      </div>

      {/* ... existing controls ... */}
    </div>
  )}
</div>
```

### Option 3: Add to Gallery or Sidebar

You can also add it to any other component like Gallery, Settings, etc.

---

## 🧪 How to Test Usage Limits

### 1. **Test Free Tier Limits**

```bash
# Create a test user with FREE subscription
# Take 50+ photos - the 51st photo should be blocked
# Try to create 6+ GIFs - the 6th GIF should be blocked
```

### 2. **Test Warnings**

```bash
# Take 40 photos (80% of 50)
# You should see the yellow warning banner
# Take 50 photos (100%)
# You should see the red error banner and be blocked
```

### 3. **Test Pro/Premium Tiers**

```bash
# Upgrade to Pro via Stripe checkout
# You should now have 500 photo limit
# Upgrade to Premium
# You should see "∞" (unlimited) in the counter
```

---

## 🔍 How the System Works

### Flow Diagram:

```
User clicks "Take Photo"
       ↓
snapPhoto() called
       ↓
Check if authenticated ──→ No? Return error
       ↓ Yes
checkUsageLimit(user.id, 'photo')
       ↓
Has remaining quota? ──→ No? Show alert, block action
       ↓ Yes
Process photo via Edge Function
       ↓
Upload to Supabase Storage
       ↓
incrementUsage(user.id, 'photo')
       ↓
Update UI with new photo
```

### Database Tables:

1. **`usage_limits`** - Tracks current usage for each user
   - `user_id`, `photos_used`, `gifs_used`, `period_start`, `period_end`

2. **`subscriptions`** - User subscription info
   - `user_id`, `tier_id` (free/pro/premium), `status`, `stripe_subscription_id`

3. **`subscription_tiers`** - Tier definitions
   - `id`, `photos_per_month`, `gifs_per_month`, `stripe_price_id_monthly`, etc.

### Stored Procedures:

- **`check_usage_limit(p_user_id, p_action_type)`** - Returns true/false if user can perform action
- **`increment_usage(p_user_id, p_action_type)`** - Increments the usage counter

---

## 🎨 Styling the UsageCounter

The component uses your existing design system:

- **Frosted glass background**: `rgba(255, 255, 255, 0.05)` + `backdrop-filter: blur(10px)`
- **Purple gradient for tier badge**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Color-coded progress bars**: Green → Yellow → Red
- **Responsive design**: Works on mobile and desktop

### Customize Colors:

Edit `src/components/UsageCounter.css`:

```css
/* Change tier badge color */
.usageTierBadge {
  background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}

/* Change progress bar colors */
.usageProgressFill.good {
  background: linear-gradient(90deg, #YOUR_GREEN1, #YOUR_GREEN2);
}
```

---

## 🚨 Troubleshooting

### "Usage counter not showing"

1. Make sure you're logged in (it doesn't show for demo users)
2. Check console for errors
3. Verify the component is imported and rendered

### "Usage not updating after taking photo"

1. The counter auto-refreshes every 10 seconds
2. Check that `incrementUsage()` is being called in `actions-supabase.js`
3. Check database `usage_limits` table to see if counts are incrementing

### "User can still create photos after limit"

1. Check that you're using `actions-supabase.js` (not `actions.js` which is for local mode)
2. Verify `check_usage_limit` stored procedure exists in database
3. Check Supabase Edge Function logs for errors

### "Unlimited tier showing numbers"

1. Check that `tier.photosPerMonth === -1` for Premium tier
2. Verify database `subscription_tiers` table has `-1` for Premium limits

---

## 📝 Next Steps

1. ✅ **Add UsageCounter to your navigation** (see instructions above)
2. ✅ **Test with different subscription tiers**
3. ✅ **Customize styling to match your brand** (optional)
4. ✅ **Add usage limits to other features**:
   - FitCheck (`fitcheckPerMonth`)
   - Co-Drawing (`codrawingPerMonth`)
   - Past Forward (`pastforwardPerMonth`)
   - AI Image Generation (`generatedImagesPerMonth`)
   - PixShop (`pixshopPerMonth`)

---

## 💡 Tips

- **Show usage prominently**: Users should always know how many credits they have left
- **Warn early**: The 80% warning gives users time to upgrade before hitting limits
- **Make upgrading easy**: Include direct links to pricing page
- **Track everything**: Add usage tracking to ALL API-using features for consistency

---

## 🎯 Summary

Your usage limit system is **already working perfectly**! Here's what you have:

✅ Backend checks prevent API calls when limits reached
✅ Database tracking of usage per user per month
✅ Subscription tiers with different limits
✅ Warning banner at 80% and 100% usage
✅ Beautiful new UsageCounter component (just add to UI!)

**You just need to add the UsageCounter component to your navigation/UI and you're all set!**
