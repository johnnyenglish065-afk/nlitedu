-- Migration to add pdf_url column to certificates table
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(512);
