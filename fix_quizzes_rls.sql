-- =====================================================
-- FIX QUIZZES RLS POLICIES
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- =====================================================

-- 1. Enable RLS on quizzes and quiz_questions (if not already enabled)
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON quizzes;
DROP POLICY IF EXISTS "Enable insert access for all users" ON quizzes;
DROP POLICY IF EXISTS "Enable update access for all users" ON quizzes;
DROP POLICY IF EXISTS "Enable delete access for all users" ON quizzes;

DROP POLICY IF EXISTS "Enable read access for all users" ON quiz_questions;
DROP POLICY IF EXISTS "Enable insert access for all users" ON quiz_questions;
DROP POLICY IF EXISTS "Enable update access for all users" ON quiz_questions;
DROP POLICY IF EXISTS "Enable delete access for all users" ON quiz_questions;

-- 3. Create policies for quizzes table to allow all operations
CREATE POLICY "Enable read access for all users" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON quizzes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON quizzes FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON quizzes FOR DELETE USING (true);

-- 4. Create policies for quiz_questions table to allow all operations
CREATE POLICY "Enable read access for all users" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON quiz_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON quiz_questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON quiz_questions FOR DELETE USING (true);
