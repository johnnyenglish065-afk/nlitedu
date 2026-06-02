-- =====================================================
-- FIX QUIZ ATTEMPTS RLS & CASCADE DELETES
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- =====================================================

-- 1. Enable RLS on quiz_attempts
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON quiz_attempts;
DROP POLICY IF EXISTS "Enable insert access for all users" ON quiz_attempts;
DROP POLICY IF EXISTS "Enable update access for all users" ON quiz_attempts;
DROP POLICY IF EXISTS "Enable delete access for all users" ON quiz_attempts;

-- 3. Create policies for quiz_attempts table to allow all operations
CREATE POLICY "Enable read access for all users" ON quiz_attempts FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON quiz_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON quiz_attempts FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON quiz_attempts FOR DELETE USING (true);

-- 4. Update Foreign Key constraints to ON DELETE CASCADE (Optional but recommended)
-- This allows deleting a quiz to automatically delete its questions and attempts
-- You can run these commands, but they might require knowing the exact constraint names.
-- Typically, they are named like 'quiz_attempts_quiz_id_fkey' and 'quiz_questions_quiz_id_fkey'

ALTER TABLE quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_quiz_id_fkey;
ALTER TABLE quiz_attempts ADD CONSTRAINT quiz_attempts_quiz_id_fkey 
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE;

ALTER TABLE quiz_questions DROP CONSTRAINT IF EXISTS quiz_questions_quiz_id_fkey;
ALTER TABLE quiz_questions ADD CONSTRAINT quiz_questions_quiz_id_fkey 
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE;
