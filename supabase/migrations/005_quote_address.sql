-- ============================================================
-- GoHorn Detailing — Migration 005
-- Add address column to quotes table
--
-- Stores the customer's address when they select "Come to me"
-- on the quote form.
--
-- Run in Supabase SQL Editor.
-- ============================================================

ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS address TEXT;
