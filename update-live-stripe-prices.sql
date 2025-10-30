-- ========================================
-- UPDATE STRIPE PRICE IDs - LIVE MODE
-- Run this in Supabase SQL Editor
-- ========================================

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
