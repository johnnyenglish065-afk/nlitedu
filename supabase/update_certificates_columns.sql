-- SQL Migration: Add compatibility columns for mobile app Achievements section
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS user_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS course_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS issued_date DATE;

-- Populate existing records if any
UPDATE certificates 
SET 
  course_title = COALESCE(course_title, course_name),
  issued_date = COALESCE(issued_date, issue_date);
