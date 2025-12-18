-- Create storage bucket for book covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view book cover images
CREATE POLICY "Public can view book covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'book-covers');

-- Allow authenticated users to upload book covers
CREATE POLICY "Authenticated users can upload book covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'book-covers' AND auth.uid() IS NOT NULL);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own book covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'book-covers' AND auth.uid() IS NOT NULL);