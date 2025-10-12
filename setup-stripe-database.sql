-- ========================================
-- GemBooth Stripe Integration Setup
-- Run this in Supabase SQL Editor
-- ========================================

-- Create updated_at function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Subscription tiers and pricing
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly DECIMAL(10, 2) NOT NULL,
  price_yearly DECIMAL(10, 2) NOT NULL,
  photos_per_month INTEGER NOT NULL,
  gifs_per_month INTEGER NOT NULL,
  storage_mb INTEGER NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default tiers (with Stripe Price IDs)
INSERT INTO public.subscription_tiers (id, name, price_monthly, price_yearly, photos_per_month, gifs_per_month, storage_mb, features, stripe_price_id_monthly, stripe_price_id_yearly)
VALUES
  ('free', 'Free', 0.00, 0.00, 50, 5, 100, '["Basic filters", "Watermarked downloads"]'::jsonb, NULL, NULL),
  ('pro', 'Pro', 9.99, 99.99, 500, 50, 5000, '["All filters", "No watermarks", "HD downloads", "Priority processing"]'::jsonb, 'price_1SHDB2EG7Jir5vNmHxHOweVa', 'price_1SHDROEG7Jir5vNmlSry2wLi'),
  ('premium', 'Premium', 19.99, 199.99, -1, -1, 50000, '["Unlimited photos", "Unlimited GIFs", "Custom branding", "API access", "Priority support"]'::jsonb, 'price_1SHDCKEG7Jir5vNmgLa26cq9', 'price_1SHDRyEG7Jir5vNmI6kwBrw6')
ON CONFLICT (id) DO UPDATE SET
  stripe_price_id_monthly = EXCLUDED.stripe_price_id_monthly,
  stripe_price_id_yearly = EXCLUDED.stripe_price_id_yearly;

-- User subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  tier_id TEXT REFERENCES public.subscription_tiers(id) NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Usage tracking for limits
CREATE TABLE IF NOT EXISTS public.usage_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  photos_used INTEGER DEFAULT 0,
  gifs_used INTEGER DEFAULT 0,
  storage_used_mb DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, period_start)
);

-- Payment history
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  stripe_payment_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_usage_limits_user_id ON public.usage_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_limits_period ON public.usage_limits(user_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
DROP TRIGGER IF EXISTS update_usage_limits_updated_at ON public.usage_limits;
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;

-- Trigger for updated_at on subscriptions
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on usage_limits
CREATE TRIGGER update_usage_limits_updated_at BEFORE UPDATE ON public.usage_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default subscription on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, tier_id)
  VALUES (NEW.id, 'free');

  INSERT INTO public.usage_limits (
    user_id,
    period_start,
    period_end
  ) VALUES (
    NEW.id,
    TIMEZONE('utc'::text, NOW()),
    TIMEZONE('utc'::text, NOW() + INTERVAL '1 month')
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create subscription
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- Function to check if user has exceeded limits
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  p_user_id UUID,
  p_action_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier_id TEXT;
  v_photos_limit INTEGER;
  v_gifs_limit INTEGER;
  v_photos_used INTEGER;
  v_gifs_used INTEGER;
BEGIN
  -- Get user's tier
  SELECT tier_id INTO v_tier_id
  FROM public.subscriptions
  WHERE user_id = p_user_id AND status = 'active';

  -- Get tier limits
  SELECT
    photos_per_month,
    gifs_per_month
  INTO v_photos_limit, v_gifs_limit
  FROM public.subscription_tiers
  WHERE id = v_tier_id;

  -- Get current usage
  SELECT
    photos_used,
    gifs_used
  INTO v_photos_used, v_gifs_used
  FROM public.usage_limits
  WHERE user_id = p_user_id
    AND period_start <= TIMEZONE('utc'::text, NOW())
    AND period_end >= TIMEZONE('utc'::text, NOW())
  LIMIT 1;

  -- Check limits (-1 means unlimited)
  IF p_action_type = 'photo' THEN
    RETURN (v_photos_limit = -1 OR v_photos_used < v_photos_limit);
  ELSIF p_action_type = 'gif' THEN
    RETURN (v_gifs_limit = -1 OR v_gifs_used < v_gifs_limit);
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_action_type TEXT
)
RETURNS VOID AS $$
BEGIN
  IF p_action_type = 'photo' THEN
    UPDATE public.usage_limits
    SET photos_used = photos_used + 1
    WHERE user_id = p_user_id
      AND period_start <= TIMEZONE('utc'::text, NOW())
      AND period_end >= TIMEZONE('utc'::text, NOW());
  ELSIF p_action_type = 'gif' THEN
    UPDATE public.usage_limits
    SET gifs_used = gifs_used + 1
    WHERE user_id = p_user_id
      AND period_start <= TIMEZONE('utc'::text, NOW())
      AND period_end >= TIMEZONE('utc'::text, NOW());
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view subscription tiers" ON public.subscription_tiers;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their own usage" ON public.usage_limits;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;

-- RLS Policies
CREATE POLICY "Anyone can view subscription tiers"
  ON public.subscription_tiers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own usage"
  ON public.usage_limits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- Success message
SELECT 'Database setup complete! Your Stripe Price IDs have been configured.' AS message;
