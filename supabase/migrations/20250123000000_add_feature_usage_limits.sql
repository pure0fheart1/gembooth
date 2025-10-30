-- Add new feature columns to subscription_tiers table
ALTER TABLE public.subscription_tiers
ADD COLUMN IF NOT EXISTS fitcheck_per_month INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS codrawing_per_month INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS pastforward_per_month INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS generated_images_per_month INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS pixshop_per_month INTEGER DEFAULT 25;

-- Update default tier limits
UPDATE public.subscription_tiers
SET
  fitcheck_per_month = 5,
  codrawing_per_month = 10,
  pastforward_per_month = 5,
  generated_images_per_month = 10,
  pixshop_per_month = 10
WHERE id = 'free';

UPDATE public.subscription_tiers
SET
  fitcheck_per_month = 50,
  codrawing_per_month = 100,
  pastforward_per_month = 50,
  generated_images_per_month = 200,
  pixshop_per_month = 100
WHERE id = 'pro';

UPDATE public.subscription_tiers
SET
  fitcheck_per_month = -1,  -- unlimited
  codrawing_per_month = -1,  -- unlimited
  pastforward_per_month = -1,  -- unlimited
  generated_images_per_month = -1,  -- unlimited
  pixshop_per_month = -1  -- unlimited
WHERE id = 'premium';

-- Add new usage tracking columns to usage_limits table
ALTER TABLE public.usage_limits
ADD COLUMN IF NOT EXISTS fitcheck_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS codrawing_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pastforward_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS generated_images_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pixshop_used INTEGER DEFAULT 0;

-- Update the check_usage_limit function to support new features
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
  v_photos_used INTEGER;
  v_gifs_used INTEGER;
  v_fitcheck_used INTEGER;
  v_codrawing_used INTEGER;
  v_pastforward_used INTEGER;
  v_generated_images_used INTEGER;
  v_pixshop_used INTEGER;
BEGIN
  -- Get user's tier
  SELECT tier_id INTO v_tier_id
  FROM public.subscriptions
  WHERE user_id = p_user_id AND status = 'active';

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

  -- Get current usage
  SELECT
    photos_used,
    gifs_used,
    fitcheck_used,
    codrawing_used,
    pastforward_used,
    generated_images_used,
    pixshop_used
  INTO v_photos_used, v_gifs_used, v_fitcheck_used, v_codrawing_used,
       v_pastforward_used, v_generated_images_used, v_pixshop_used
  FROM public.usage_limits
  WHERE user_id = p_user_id
    AND period_start <= TIMEZONE('utc'::text, NOW())
    AND period_end >= TIMEZONE('utc'::text, NOW())
  LIMIT 1;

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

-- Update the increment_usage function to support new features
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_action_type TEXT
)
RETURNS VOID AS $$
BEGIN
  CASE p_action_type
    WHEN 'photo' THEN
      UPDATE public.usage_limits
      SET photos_used = photos_used + 1
      WHERE user_id = p_user_id
        AND period_start <= TIMEZONE('utc'::text, NOW())
        AND period_end >= TIMEZONE('utc'::text, NOW());
    WHEN 'gif' THEN
      UPDATE public.usage_limits
      SET gifs_used = gifs_used + 1
      WHERE user_id = p_user_id
        AND period_start <= TIMEZONE('utc'::text, NOW())
        AND period_end >= TIMEZONE('utc'::text, NOW());
    WHEN 'fitcheck' THEN
      UPDATE public.usage_limits
      SET fitcheck_used = fitcheck_used + 1
      WHERE user_id = p_user_id
        AND period_start <= TIMEZONE('utc'::text, NOW())
        AND period_end >= TIMEZONE('utc'::text, NOW());
    WHEN 'codrawing' THEN
      UPDATE public.usage_limits
      SET codrawing_used = codrawing_used + 1
      WHERE user_id = p_user_id
        AND period_start <= TIMEZONE('utc'::text, NOW())
        AND period_end >= TIMEZONE('utc'::text, NOW());
    WHEN 'pastforward' THEN
      UPDATE public.usage_limits
      SET pastforward_used = pastforward_used + 1
      WHERE user_id = p_user_id
        AND period_start <= TIMEZONE('utc'::text, NOW())
        AND period_end >= TIMEZONE('utc'::text, NOW());
    WHEN 'generated_image' THEN
      UPDATE public.usage_limits
      SET generated_images_used = generated_images_used + 1
      WHERE user_id = p_user_id
        AND period_start <= TIMEZONE('utc'::text, NOW())
        AND period_end >= TIMEZONE('utc'::text, NOW());
    WHEN 'pixshop' THEN
      UPDATE public.usage_limits
      SET pixshop_used = pixshop_used + 1
      WHERE user_id = p_user_id
        AND period_start <= TIMEZONE('utc'::text, NOW())
        AND period_end >= TIMEZONE('utc'::text, NOW());
    ELSE
      NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON COLUMN public.subscription_tiers.fitcheck_per_month IS 'FitCheck virtual try-on uses per month (-1 = unlimited)';
COMMENT ON COLUMN public.subscription_tiers.codrawing_per_month IS 'Co-Drawing sessions per month (-1 = unlimited)';
COMMENT ON COLUMN public.subscription_tiers.pastforward_per_month IS 'Past Forward transformations per month (-1 = unlimited)';
COMMENT ON COLUMN public.subscription_tiers.generated_images_per_month IS 'AI-generated images per month (-1 = unlimited)';
COMMENT ON COLUMN public.subscription_tiers.pixshop_per_month IS 'PixShop edits per month (-1 = unlimited)';

COMMENT ON COLUMN public.usage_limits.fitcheck_used IS 'Number of FitCheck uses this period';
COMMENT ON COLUMN public.usage_limits.codrawing_used IS 'Number of Co-Drawing sessions this period';
COMMENT ON COLUMN public.usage_limits.pastforward_used IS 'Number of Past Forward transformations this period';
COMMENT ON COLUMN public.usage_limits.generated_images_used IS 'Number of AI-generated images this period';
COMMENT ON COLUMN public.usage_limits.pixshop_used IS 'Number of PixShop edits this period';
