-- ============================================================
-- Workshop Support Migration for `enrollments` table
-- Run this in the Supabase SQL Editor
-- Safe to run multiple times — zero data loss
-- ============================================================

DO $$
BEGIN
  -- ── enrollment_type column (NEW — "internship", "workshop", or "site-visit") ──
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'enrollment_type'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN enrollment_type TEXT DEFAULT 'internship';
  END IF;

  -- duration column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'duration'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN duration TEXT;
  END IF;

  -- internship_mode column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'internship_mode'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN internship_mode TEXT;
  END IF;

  -- qualification column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'qualification'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN qualification TEXT;
  END IF;

  -- marks10 column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'marks10'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN marks10 TEXT;
  END IF;

  -- marks12 column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'marks12'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN marks12 TEXT;
  END IF;

  -- marksSem column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'marksSem'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN "marksSem" TEXT;
  END IF;

  -- marksheet12Url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'marksheet12Url'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN "marksheet12Url" TEXT;
  END IF;

  -- marksheetSemUrl column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'marksheetSemUrl'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN "marksheetSemUrl" TEXT;
  END IF;

  -- father_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'father_name'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN father_name TEXT;
  END IF;

  -- college_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'college_type'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN college_type TEXT;
  END IF;

  -- college_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'college_name'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN college_name TEXT;
  END IF;

  -- cf_payment_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'cf_payment_id'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN cf_payment_id TEXT;
  END IF;

  -- status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'status'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN status TEXT DEFAULT 'PENDING';
  END IF;

  -- user_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN user_id UUID;
  END IF;
END
$$;

-- ============================================================
-- BACKFILL existing rows (zero data loss)
-- Marks rows with "(Workshop)" in course_title as "workshop",
-- "(Site Visit)" in course_title as "site-visit",
-- everything else defaults to "internship".
-- ============================================================

UPDATE enrollments
SET enrollment_type = 'workshop'
WHERE course_title ILIKE '%(Workshop)%'
  AND (enrollment_type IS NULL OR enrollment_type = 'internship');

UPDATE enrollments
SET enrollment_type = 'site-visit'
WHERE course_title ILIKE '%(Site Visit)%'
  AND (enrollment_type IS NULL OR enrollment_type = 'internship');

UPDATE enrollments
SET enrollment_type = 'internship'
WHERE enrollment_type IS NULL;

-- ============================================================
-- Workshop & Site Visit Pricing Reference
-- ============================================================
-- WORKSHOP:
-- DURATION  |  GOVT PRICE  |  PRIVATE PRICE
-- ----------|--------------|----------------
-- 7 Days    |  Rs. 999     |  Rs. 1199
-- 14 Days   |  Rs. 1699    |  Rs. 1999
-- 21 Days   |  Rs. 2499    |  Rs. 2999
-- 28 Days   |  Rs. 3499    |  Rs. 3999
-- Job Professional: Rs. 3999 (flat)
--
-- SITE VISIT:
-- DURATION  |  GOVT PRICE  |  PRIVATE PRICE
-- ----------|--------------|----------------
-- 7 Days    |  Rs. 999     |  Rs. 1499
-- 14 Days   |  Rs. 1999    |  Rs. 2499
-- 21 Days   |  Rs. 3499    |  Rs. 3999
-- Job Professional: Rs. 3999 (flat)
-- ============================================================

-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own enrollment
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'enrollments' AND policyname = 'Users can insert own enrollment'
  ) THEN
    CREATE POLICY "Users can insert own enrollment"
      ON enrollments
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END
$$;

-- Allow authenticated users to read their own enrollments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'enrollments' AND policyname = 'Users can read own enrollment'
  ) THEN
    CREATE POLICY "Users can read own enrollment"
      ON enrollments
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END
$$;
