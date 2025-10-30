-- Create codrawings table for AI Co-Drawing Studio
CREATE TABLE IF NOT EXISTS codrawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pastforward_images table for Past Forward time travel feature
CREATE TABLE IF NOT EXISTS pastforward_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  decade TEXT NOT NULL,
  original_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_codrawings_user_id ON codrawings(user_id);
CREATE INDEX IF NOT EXISTS idx_codrawings_created_at ON codrawings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pastforward_user_id ON pastforward_images(user_id);
CREATE INDEX IF NOT EXISTS idx_pastforward_created_at ON pastforward_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pastforward_decade ON pastforward_images(decade);

-- Add RLS (Row Level Security) policies
ALTER TABLE codrawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pastforward_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own codrawings" ON codrawings;
DROP POLICY IF EXISTS "Users can insert their own codrawings" ON codrawings;
DROP POLICY IF EXISTS "Users can delete their own codrawings" ON codrawings;
DROP POLICY IF EXISTS "Users can view their own pastforward images" ON pastforward_images;
DROP POLICY IF EXISTS "Users can insert their own pastforward images" ON pastforward_images;
DROP POLICY IF EXISTS "Users can delete their own pastforward images" ON pastforward_images;

-- Policies for codrawings
CREATE POLICY "Users can view their own codrawings"
  ON codrawings
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own codrawings"
  ON codrawings
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own codrawings"
  ON codrawings
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);

-- Policies for pastforward_images
CREATE POLICY "Users can view their own pastforward images"
  ON pastforward_images
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pastforward images"
  ON pastforward_images
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pastforward images"
  ON pastforward_images
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);
