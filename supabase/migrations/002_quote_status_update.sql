-- ============================================================
-- GoHorn Detailing — Migration 002
-- Update quotes.status values to match admin workflow
--
-- Old values: new, reviewed, quoted, booked, closed
-- New values: new, contacted, quoted, converted, archived
--
-- Safe to run with existing data — updates rows before
-- changing the constraint. Run in Supabase SQL Editor.
-- ============================================================

-- Step 1: Migrate existing rows to new value names
UPDATE quotes SET status = 'contacted' WHERE status = 'reviewed';
UPDATE quotes SET status = 'converted'  WHERE status = 'booked';
UPDATE quotes SET status = 'archived'   WHERE status = 'closed';

-- Step 2: Swap the CHECK constraint
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_status_check;

ALTER TABLE quotes
  ADD CONSTRAINT quotes_status_check
  CHECK (status IN ('new', 'contacted', 'quoted', 'converted', 'archived'));
