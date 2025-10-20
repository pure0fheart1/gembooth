-- Create custom_modes table for premium users to save personalized AI transformation modes
CREATE TABLE IF NOT EXISTS custom_modes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '✨',
  prompt TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure mode names are unique per user
  CONSTRAINT unique_user_mode_name UNIQUE (user_id, name)
);

-- Create index for faster queries
CREATE INDEX idx_custom_modes_user_id ON custom_modes(user_id);
CREATE INDEX idx_custom_modes_user_favorites ON custom_modes(user_id, is_favorite);

-- Enable RLS
ALTER TABLE custom_modes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own custom modes
CREATE POLICY "Users can view their own custom modes"
  ON custom_modes FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom modes"
  ON custom_modes FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom modes"
  ON custom_modes FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom modes"
  ON custom_modes FOR DELETE
  TO public
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_custom_modes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER custom_modes_updated_at
  BEFORE UPDATE ON custom_modes
  FOR EACH ROW
  EXECUTE FUNCTION update_custom_modes_updated_at();
