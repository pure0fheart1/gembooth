-- Add favorite_modes column to profiles table
ALTER TABLE public.profiles
ADD COLUMN favorite_modes JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.profiles.favorite_modes IS 'Array of mode keys that user has marked as favorites';
