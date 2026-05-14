-- =====================================================
-- FIX RLS POLICIES - Run in Supabase SQL Editor
-- Previous policies failed because anon role can't access auth.users
-- This version uses auth.jwt() which works for all roles
-- =====================================================

-- 1. Drop broken policies
DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can view enrollments by email" ON enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON enrollments;

-- 2. Create working SELECT policy using auth.uid() and auth.jwt()
CREATE POLICY "Users can view own enrollments"
  ON enrollments
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR email = (auth.jwt() ->> 'email')
  );

-- 3. Create UPDATE policy so dashboard can link orphaned enrollments  
CREATE POLICY "Users can update own enrollments"
  ON enrollments
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR email = (auth.jwt() ->> 'email')
  )
  WITH CHECK (
    user_id = auth.uid()
  );

-- 4. Create INSERT policy for enrollment form
DROP POLICY IF EXISTS "Users can insert enrollments" ON enrollments;
CREATE POLICY "Users can insert enrollments"
  ON enrollments
  FOR INSERT
  WITH CHECK (true);

-- 5. Make sure RLS is enabled
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- 6. Fix profiles policies too
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- 7. Verify enrollment data exists and is linked
SELECT id, full_name, email, user_id, status, course_title 
FROM enrollments 
ORDER BY created_at DESC 
LIMIT 10;
