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

-- Symptom History Table
CREATE TABLE IF NOT EXISTS public.symptom_history (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL,
  demographics jsonb NOT NULL,
  symptoms jsonb NOT NULL,
  ai_assessment jsonb NOT NULL,
  severity_level text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT symptom_history_pkey PRIMARY KEY (id)
);

-- Enable RLS for symptom history
ALTER TABLE public.symptom_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service role full access" ON public.symptom_history FOR ALL USING (true);
CREATE POLICY "Users can view their own history" ON public.symptom_history FOR SELECT USING (auth.uid() = user_id);
