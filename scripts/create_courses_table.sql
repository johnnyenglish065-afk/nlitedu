-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  duration TEXT,
  level TEXT,
  price_label TEXT,
  is_bestseller BOOLEAN DEFAULT false,
  highlights TEXT[],
  syllabus JSONB,
  instructor_name TEXT,
  -- Pricing
  govt_price NUMERIC NOT NULL,
  pvt_price NUMERIC NOT NULL,
  job_price NUMERIC NOT NULL,
  is_legacy_pricing BOOLEAN DEFAULT false,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all courses
CREATE POLICY "Allow public read access on courses" ON public.courses
  FOR SELECT USING (true);

-- Allow authenticated users (admin) to insert/update/delete
-- Ensure you have appropriate admin roles set up in your actual production environment
CREATE POLICY "Allow authenticated users to insert courses" ON public.courses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update courses" ON public.courses
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete courses" ON public.courses
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create an index on the slug for faster lookups
CREATE INDEX IF NOT EXISTS courses_slug_idx ON public.courses (slug);
