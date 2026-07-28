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
