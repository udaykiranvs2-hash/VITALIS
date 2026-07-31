-- Vitalis Health Supabase Schema Definition
-- Run this script in your Supabase Project -> SQL Editor to create the users table.

CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  auth_provider TEXT DEFAULT 'email',
  role TEXT DEFAULT 'user',
  profile JSONB DEFAULT '{}'::jsonb,
  reports JSONB DEFAULT '[]'::jsonb,
  appointments JSONB DEFAULT '[]'::jsonb,
  notifications JSONB DEFAULT '[]'::jsonb,
  history JSONB DEFAULT '[]'::jsonb,
  reset_token TEXT,
  reset_token_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow Service Role and Anon full access for backend operations
CREATE POLICY "Allow service role full access" ON public.users FOR ALL USING (true);
