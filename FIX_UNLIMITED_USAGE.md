# Fix for Unlimited Usage Limits Bug

## The Problem
The database function `check_usage_limit` doesn't properly handle NULL values when checking usage. This causes unlimited plans to show as having 0 remaining uses.

## The Solution
Execute the SQL below in your Supabase Dashboard SQL Editor to fix the database function.

## Steps to Apply the Fix

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/cahdabrkluflhlwexqsc/sql/new

2. **Paste the SQL below** into the SQL Editor

3. **Click "Run"** to execute

4. **Refresh your app** - the issue should be fixed!

---

## SQL to Execute:

```sql
-- Fix check_usage_limit function to properly handle NULL usage values
-- When a user doesn't have a usage_limits record, all usage should be treated as 0
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  p_user_id UUID,
  p_action_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier_id TEXT;
  v_photos_limit INTEGER;
  v_gifs_limit INTEGER;
  v_fitcheck_limit INTEGER;
  v_codrawing_limit INTEGER;
  v_pastforward_limit INTEGER;
  v_generated_images_limit INTEGER;
  v_pixshop_limit INTEGER;
  v_photos_used INTEGER := 0;
  v_gifs_used INTEGER := 0;
  v_fitcheck_used INTEGER := 0;
  v_codrawing_used INTEGER := 0;
  v_pastforward_used INTEGER := 0;
  v_generated_images_used INTEGER := 0;
  v_pixshop_used INTEGER := 0;
BEGIN
  -- Get user's tier
  SELECT tier_id INTO v_tier_id
  FROM public.subscriptions
  WHERE user_id = p_user_id AND status = 'active';

  -- If no active subscription, deny by default
  IF v_tier_id IS NULL THEN
    RETURN false;
  END IF;

  -- Get tier limits
  SELECT
    photos_per_month,
    gifs_per_month,
    fitcheck_per_month,
    codrawing_per_month,
    pastforward_per_month,
    generated_images_per_month,
    pixshop_per_month
  INTO v_photos_limit, v_gifs_limit, v_fitcheck_limit, v_codrawing_limit,
       v_pastforward_limit, v_generated_images_limit, v_pixshop_limit
  FROM public.subscription_tiers
  WHERE id = v_tier_id;

  -- Get current usage (COALESCE ensures NULL becomes 0)
  SELECT
    COALESCE(photos_used, 0),
    COALESCE(gifs_used, 0),
    COALESCE(fitcheck_used, 0),
    COALESCE(codrawing_used, 0),
    COALESCE(pastforward_used, 0),
    COALESCE(generated_images_used, 0),
    COALESCE(pixshop_used, 0)
  INTO v_photos_used, v_gifs_used, v_fitcheck_used, v_codrawing_used,
       v_pastforward_used, v_generated_images_used, v_pixshop_used
  FROM public.usage_limits
  WHERE user_id = p_user_id
    AND period_start <= TIMEZONE('utc'::text, NOW())
    AND period_end >= TIMEZONE('utc'::text, NOW())
  LIMIT 1;

  -- If no usage record found, all usage values are already initialized to 0 above

  -- Check limits (-1 means unlimited)
  CASE p_action_type
    WHEN 'photo' THEN
      RETURN (v_photos_limit = -1 OR v_photos_used < v_photos_limit);
    WHEN 'gif' THEN
      RETURN (v_gifs_limit = -1 OR v_gifs_used < v_gifs_limit);
    WHEN 'fitcheck' THEN
      RETURN (v_fitcheck_limit = -1 OR v_fitcheck_used < v_fitcheck_limit);
    WHEN 'codrawing' THEN
      RETURN (v_codrawing_limit = -1 OR v_codrawing_used < v_codrawing_limit);
    WHEN 'pastforward' THEN
      RETURN (v_pastforward_limit = -1 OR v_pastforward_used < v_pastforward_limit);
    WHEN 'generated_image' THEN
      RETURN (v_generated_images_limit = -1 OR v_generated_images_used < v_generated_images_limit);
    WHEN 'pixshop' THEN
      RETURN (v_pixshop_limit = -1 OR v_pixshop_used < v_pixshop_limit);
    ELSE
      RETURN true;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## What This Fix Does

### Key Changes:

1. **NULL Handling**: Initializes all usage variables to `0` by default
   ```sql
   v_photos_used INTEGER := 0;
   v_gifs_used INTEGER := 0;
   -- etc...
   ```

2. **COALESCE**: Wraps all SELECT fields to convert NULL to 0
   ```sql
   COALESCE(generated_images_used, 0)
   ```

3. **Subscription Check**: Returns `false` if no active subscription found

### How It Works:

- **Unlimited Plans**: When `limit = -1`, the check `(v_generated_images_limit = -1 OR ...)` returns TRUE
- **Limited Plans**: Compares usage vs limit properly with `v_generated_images_used < v_generated_images_limit`
- **No Usage Record**: Treats missing usage_limits record as 0 usage (allows operations)

---

## Verification

After applying the fix:

1. Navigate to `/generate` page
2. Try generating 1 image
3. You should see the generation succeed without the "0 generations remaining" error
4. Check your subscription page - it should show unlimited for all features

---

## Alternative: Apply via CLI

If you prefer using the CLI:

```bash
cd C:\Users\jamie\Desktop\gembooth
export SUPABASE_ACCESS_TOKEN=sbp_314778b36840030abc2d837f4283d6f881aeb9a5
npx supabase db execute --file supabase/migrations/20250124000000_fix_usage_check_nulls.sql --linked
```
