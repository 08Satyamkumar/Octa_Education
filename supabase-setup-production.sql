-- ==============================================================================
-- OCTA EDUCATION - SUPABASE PRODUCTION DATABASE SETUP & SECURITY CONFIGURATION
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Ensure 'colleges' table exists with all necessary columns
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    location TEXT DEFAULT 'India',
    city TEXT DEFAULT 'Delhi NCR',
    state TEXT DEFAULT 'Delhi',
    ownership TEXT DEFAULT 'Private',
    rating NUMERIC(3, 1) DEFAULT 4.2,
    nirf_rank TEXT DEFAULT 'N/A',
    courses_count TEXT DEFAULT 'Multiple Courses',
    exams_accepted TEXT DEFAULT 'Entrance Exam / Merit',
    tuition_fees TEXT DEFAULT 'N/A',
    image_url TEXT DEFAULT '/images/iitdelhi_real.jpg',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. Ensure 'leads' table exists for student inquiries
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    course_interest TEXT,
    state_interest TEXT,
    college_interest TEXT,
    status TEXT DEFAULT 'New',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. High Performance Indexes (Zero Lag for 5,000+ Colleges)
CREATE INDEX IF NOT EXISTS idx_colleges_slug ON public.colleges(slug);
CREATE INDEX IF NOT EXISTS idx_colleges_city ON public.colleges(city);
CREATE INDEX IF NOT EXISTS idx_colleges_state ON public.colleges(state);
CREATE INDEX IF NOT EXISTS idx_colleges_rating ON public.colleges(rating DESC);
CREATE INDEX IF NOT EXISTS idx_colleges_ownership ON public.colleges(ownership);
CREATE INDEX IF NOT EXISTS idx_colleges_created_at ON public.colleges(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- 4. Enable Row Level Security (RLS) - Full Protection
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 5. Drop old conflicting policies if present
DROP POLICY IF EXISTS "Allow public read access on colleges" ON public.colleges;
DROP POLICY IF EXISTS "Disallow public write on colleges" ON public.colleges;
DROP POLICY IF EXISTS "Allow public read on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert on leads" ON public.leads;

-- 6. Setup Safe Security Policies:
-- A) Public can view (SELECT) all colleges
CREATE POLICY "Allow public read access on colleges"
ON public.colleges FOR SELECT
USING (true);

-- B) Public CANNOT read leads data (Strict student privacy)
-- C) Public CAN insert new inquiries into leads (Lead Form Submissions)
CREATE POLICY "Allow public insert on leads"
ON public.leads FOR INSERT
WITH CHECK (true);

-- All college mutations (Add/Update/Delete) and lead management are handled
-- securely by our Next.js backend using the Service Role Key (bypassing RLS safely).
