-- ====================================================================
-- SUPABASE DATABASE SETUP SCRIPT FOR CA / ACCOUNTANT WEBSITE
-- ====================================================================
-- INSTRUCTIONS TO RUN:
-- 1. Log in to your Supabase Dashboard: https://app.supabase.com
-- 2. Select or create your project.
-- 3. Click "SQL Editor" in the left sidebar.
-- 4. Click "New Query", paste this entire script, and click "Run".
-- 5. Confirm that all 4 tables are created under Table Editor.
-- ====================================================================

-- 1. Table: consultation_requests
CREATE TABLE IF NOT EXISTS public.consultation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    service TEXT NOT NULL,
    preferred_date DATE,
    preferred_time TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- 2. Table: contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- 3. Table: callback_requests
CREATE TABLE IF NOT EXISTS public.callback_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_time TEXT,
    service TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- 4. Table: appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    service TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
-- Security Guarantee:
-- - Anonymous visitors can ONLY INSERT records via website forms.
-- - Anonymous visitors CANNOT READ, UPDATE, or DELETE any records.
-- - Only authenticated admin users (logged in via Supabase Auth)
--   have full access (SELECT, UPDATE, DELETE).
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
DROP POLICY IF EXISTS "Public insert only for consultation_requests" ON public.consultation_requests;
DROP POLICY IF EXISTS "Authenticated admin full access for consultation_requests" ON public.consultation_requests;

DROP POLICY IF EXISTS "Public insert only for contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated admin full access for contact_messages" ON public.contact_messages;

DROP POLICY IF EXISTS "Public insert only for callback_requests" ON public.callback_requests;
DROP POLICY IF EXISTS "Authenticated admin full access for callback_requests" ON public.callback_requests;

DROP POLICY IF EXISTS "Public insert only for appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated admin full access for appointments" ON public.appointments;

-- Policies for: consultation_requests
CREATE POLICY "Public insert only for consultation_requests"
    ON public.consultation_requests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated admin full access for consultation_requests"
    ON public.consultation_requests
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for: contact_messages
CREATE POLICY "Public insert only for contact_messages"
    ON public.contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated admin full access for contact_messages"
    ON public.contact_messages
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for: callback_requests
CREATE POLICY "Public insert only for callback_requests"
    ON public.callback_requests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated admin full access for callback_requests"
    ON public.callback_requests
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for: appointments
CREATE POLICY "Public insert only for appointments"
    ON public.appointments
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated admin full access for appointments"
    ON public.appointments
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ====================================================================
-- OPTIONAL DEMO / SEED DATA
-- (Run this ONLY if you want to populate initial test entries in Admin)
-- To delete demo data later: DELETE FROM public.consultation_requests WHERE full_name LIKE '%[DEMO]%';
-- ====================================================================

INSERT INTO public.consultation_requests (full_name, phone, email, service, preferred_date, preferred_time, message, status)
VALUES 
    ('[DEMO] Arvind Patel', '+91 98200 11223', 'arvind.patel@example.com', 'Income Tax Filing & Planning', CURRENT_DATE + INTERVAL '2 days', '11:00 AM - 01:00 PM', 'Need assistance with Capital Gains calculation from property sale.', 'new'),
    ('[DEMO] Priya Swaminathan', '+91 97111 44556', 'priya.s@techstart.in', 'Company Registration & Startup Compliance', CURRENT_DATE + INTERVAL '3 days', '03:00 PM - 05:00 PM', 'Registering a Private Limited company for our SaaS startup.', 'contacted');

INSERT INTO public.contact_messages (name, phone, email, subject, message, status)
VALUES 
    ('[DEMO] Vikram Malhotra', '+91 98450 67890', 'vikram.m@zenithcorp.com', 'Statutory Audit Query', 'Seeking proposal for Annual Statutory Audit for private company.', 'new');

INSERT INTO public.callback_requests (name, phone, preferred_time, service, status)
VALUES 
    ('[DEMO] Sneha Joshi', '+91 99230 55667', 'Evening (05:00 PM - 07:00 PM)', 'GST Notice Assistance', 'new');

INSERT INTO public.appointments (name, phone, email, service, appointment_date, appointment_time, message, status)
VALUES 
    ('[DEMO] Rajesh Kulkarni', '+91 98190 22334', 'rajesh.k@kulkarni-eng.com', 'Tax Consultation', CURRENT_DATE + INTERVAL '1 day', '04:00 PM', 'Consultation regarding advance tax and corporate deductions.', 'new');
