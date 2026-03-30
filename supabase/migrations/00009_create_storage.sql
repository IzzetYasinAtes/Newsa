-- Storage bucket'ları oluştur
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('articles', 'articles', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('media', 'media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm']);

-- Storage RLS politikaları
CREATE POLICY "Public can view article images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('articles', 'avatars', 'media'));

CREATE POLICY "Auth users can upload to articles bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'articles' AND auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can upload to media bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Auth users can delete own uploads"
  ON storage.objects FOR DELETE
  USING (auth.uid() IS NOT NULL);
