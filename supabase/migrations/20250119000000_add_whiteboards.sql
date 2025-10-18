-- Migration: Add whiteboards table for saving whiteboard drawings
-- Created: 2025-01-19

-- Create whiteboards table
CREATE TABLE whiteboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX idx_whiteboards_user_id ON whiteboards(user_id);
CREATE INDEX idx_whiteboards_created_at ON whiteboards(created_at DESC);

-- Enable Row Level Security
ALTER TABLE whiteboards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own whiteboards"
ON whiteboards FOR SELECT TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own whiteboards"
ON whiteboards FOR INSERT TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own whiteboards"
ON whiteboards FOR UPDATE TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own whiteboards"
ON whiteboards FOR DELETE TO public
USING (auth.uid() = user_id);
