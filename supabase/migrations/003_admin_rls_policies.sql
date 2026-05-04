-- Admin RLS policies
-- Run this in the Supabase SQL Editor AFTER creating your admin user.
--
-- These policies let any authenticated Supabase user read and update all
-- bookings and quotes. Since you control who gets an account (you create
-- admin users manually in the dashboard), this is safe for a single-admin setup.

-- ── Bookings ────────────────────────────────────────────────────────────────

CREATE POLICY "admin_select_bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin_update_bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── Quotes ──────────────────────────────────────────────────────────────────

CREATE POLICY "admin_select_quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "admin_update_quotes"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
