import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iipljojbqkeblrtfmyhr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcGxqb2picWtlYmxydGZteWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTMxNjIsImV4cCI6MjEwMDc4OTE2Mn0.o7Yt50qYMIYoEUVeYGg8-Xfo-JlAlachRHGfS8Zwjr4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

