-- Enable RLS on generated_images table
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own generated images
CREATE POLICY "Users can view their own generated images"
  ON public.generated_images FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- Allow users to insert their own generated images
CREATE POLICY "Users can insert their own generated images"
  ON public.generated_images FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own generated images
CREATE POLICY "Users can delete their own generated images"
  ON public.generated_images FOR DELETE
  TO public
  USING (auth.uid() = user_id);

-- Allow users to view public generated images
CREATE POLICY "Anyone can view public generated images"
  ON public.generated_images FOR SELECT
  TO public
  USING (is_public = true);
