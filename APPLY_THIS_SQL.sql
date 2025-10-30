-- ========================================
-- GEMBOOTH PRICING FIX - MONTHLY ONLY
-- ========================================
-- Copy and paste this entire SQL into Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/cahdabrkluflhlwexqsc/sql

-- Update Pro tier with monthly price ID
UPDATE subscription_tiers
SET
  stripe_price_id_monthly = 'price_1SHDB2EG7Jir5vNmHxHOweVa',
  stripe_price_id_yearly = NULL
WHERE id = 'pro';

-- Update Premium tier with monthly price ID
UPDATE subscription_tiers
SET
  stripe_price_id_monthly = 'price_1SHDCKEG7Jir5vNmgLa26cq9',
  stripe_price_id_yearly = NULL
WHERE id = 'premium';

-- Verify the updates (you should see the price IDs in the monthly column)
SELECT
  id,
  name,
  stripe_price_id_monthly,
  stripe_price_id_yearly,
  price_monthly,
  price_yearly
FROM subscription_tiers
ORDER BY id;

-- Expected results:
-- | id      | name              | stripe_price_id_monthly           | stripe_price_id_yearly | price_monthly | price_yearly |
-- |---------|-------------------|-----------------------------------|------------------------|---------------|--------------|
-- | free    | Free              | NULL                              | NULL                   | 0             | 0            |
-- | premium | Premium           | price_1SHDCKEG7Jir5vNmgLa26cq9    | NULL                   | 19.99         | NULL         |
-- | pro     | Pro               | price_1SHDB2EG7Jir5vNmHxHOweVa    | NULL                   | 9.99          | NULL         |
