-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('user-photos', 'user-photos', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('user-gifs', 'user-gifs', false, 52428800, ARRAY['image/gif']);

-- Storage policies for user-photos bucket
CREATE POLICY "Users can upload their own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for user-gifs bucket
CREATE POLICY "Users can upload their own gifs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-gifs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own gifs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-gifs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own gifs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-gifs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
