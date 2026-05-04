-- ============================================================
-- GoHorn Detailing — Migration 004
-- Photo uploads for quote form
--
-- 1. Adds photo_urls column to quotes table
-- 2. Sets up Storage RLS policies on the quote-photos bucket
--
-- Run in Supabase SQL Editor.
-- ============================================================

-- Add photo_urls column (safe to run even if column already exists)
ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS photo_urls TEXT[] DEFAULT '{}';

-- ── Storage policies for the quote-photos bucket ─────────────────────────────
-- Supabase Storage uses RLS on the storage.objects table.

-- 1. Anyone (anonymous or authenticated) can upload photos.
--    This powers the public /quote form without requiring a login.
CREATE POLICY "allow_quote_photo_uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'quote-photos');

-- 2. Anyone can read/download photos.
--    Public URLs in emails and the admin panel need to load without auth.
CREATE POLICY "allow_quote_photo_reads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'quote-photos');

-- 3. Only authenticated users (admin) can delete photos.
--    Keeps cleanup capability without exposing it publicly.
CREATE POLICY "allow_admin_photo_deletes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'quote-photos');
