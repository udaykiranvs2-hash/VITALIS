-- Migration to create the users table for Vitalis
-- Run this in the Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT DEFAULT 'user',
  profile JSONB DEFAULT '{}'::jsonb,
  reports JSONB DEFAULT '[]'::jsonb,
  appointments JSONB DEFAULT '[]'::jsonb,
  notifications JSONB DEFAULT '[]'::jsonb,
  history JSONB DEFAULT '[]'::jsonb,
  reset_token TEXT,
  reset_token_expires BIGINT
);

-- Enable RLS (Row Level Security) as per Supabase security best practices.
-- Since the Node.js backend uses the SUPABASE_SERVICE_ROLE_KEY, it will automatically bypass RLS.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.symptom_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    demographics JSONB,
    symptoms JSONB,
    ai_assessment JSONB,
    severity_level TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: Under the current custom-JWT auth model, these RLS policies are non-functional.
-- Access control is strictly enforced in the Express application via the `protect` middleware
-- and explicit `user_id = req.userId` WHERE clause filters.
ALTER TABLE public.symptom_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own symptom history" 
ON public.symptom_history FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own symptom history" 
ON public.symptom_history FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);
