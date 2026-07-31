-- Run this in the Supabase SQL Editor
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS certificate_type text DEFAULT 'internship';
