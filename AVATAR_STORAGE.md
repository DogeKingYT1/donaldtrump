# Avatar Storage Setup

To enable profile picture uploads, you need to create a storage bucket in Supabase.

## Manual Setup (Supabase Dashboard)

1. Go to Supabase → Storage → Buckets
2. Click "New bucket"
3. Name: `avatars`
4. Make it **Public** (toggle "Public bucket")
5. Click Create

## Storage Policies

The bucket should have:
- **Public Read**: Anyone can view avatars
- **Authenticated Upload**: Only logged-in users can upload to their own folder

If you need to set custom policies, use these SQL rules:

```sql
-- Public read policy
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);
```

Once set up, users can upload profile pictures in `/dashboard/settings`.
