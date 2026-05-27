-- =====================================================
-- ADD INTERNSHIP MODE COLUMN TO ENROLLMENTS
-- Run this in the Supabase SQL Editor (https://supabase.com)
-- =====================================================

-- Add the internship_mode column if it doesn't already exist
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS internship_mode TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'enrollments' AND column_name = 'internship_mode';
