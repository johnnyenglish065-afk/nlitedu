-- Create deletion_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.deletion_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    email TEXT NOT NULL,
    requested_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'PENDING' NOT NULL,
    processed_at TIMESTAMPTZ
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own deletion request
CREATE POLICY "Allow users to insert their own deletion request" 
ON public.deletion_requests 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own deletion request
CREATE POLICY "Allow users to read their own deletion request" 
ON public.deletion_requests 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
