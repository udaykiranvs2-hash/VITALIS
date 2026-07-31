import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const email = `test12345@test.com`;
const password = 'Test1234!';

async function test() {
  console.log('Signing up...');
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) {
    console.error('Signup error:', error);
    return;
  }
  
  console.log('Signup successful, session:', !!data.session);
  
  console.log('Attempting login...');
  const loginRes = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (loginRes.error) {
    console.error('Login error:', loginRes.error);
    return;
  }
  
  console.log('Login successful, access_token length:', loginRes.data.session.access_token.length);
}

test();
