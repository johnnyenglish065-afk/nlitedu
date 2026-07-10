-- =====================================================
-- FIX CERTIFICATES TABLE RLS POLICIES
-- Run this in Supabase SQL Editor to allow certificate
-- generation API to INSERT/UPDATE certificate records.
-- =====================================================

-- 1. Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access for certificates" ON certificates;
DROP POLICY IF EXISTS "Service role full access on certificates" ON certificates;
DROP POLICY IF EXISTS "Allow insert certificates" ON certificates;
DROP POLICY IF EXISTS "Allow update certificates" ON certificates;

-- 2. Ensure RLS is enabled
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- 3. Public read access (for verification portal)
CREATE POLICY "Allow public read access for certificates"
ON certificates
FOR SELECT
TO public
USING (true);

-- 4. Allow INSERT for all roles (needed for certificate generation via API)
CREATE POLICY "Allow insert certificates"
ON certificates
FOR INSERT
TO anon, authenticated, service_role
WITH CHECK (true);

-- 5. Allow UPDATE for all roles (needed for updating pdf_url after Cloudinary upload)
CREATE POLICY "Allow update certificates"
ON certificates
FOR UPDATE
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

-- 6. Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'certificates';
