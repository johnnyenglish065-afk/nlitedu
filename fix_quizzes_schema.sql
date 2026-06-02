-- =====================================================
-- FIX QUIZZES TABLE SCHEMA
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- =====================================================

-- 1. Add the missing scheduled_for column
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ;

-- 2. Notify PostgREST to reload the schema cache so the API recognizes the new column
NOTIFY pgrst, 'reload schema';

-- 3. Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quizzes' AND column_name = 'scheduled_for';
