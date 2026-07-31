import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const email = `testuser-${Date.now()}@example.com`;
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
  
  console.log('Signup successful:', data.user?.id);
  
  console.log('Getting session...');
  const session = data.session;
  
  if (!session) {
    console.log('No session returned. Email confirmation might be required.');
    
    // Try to login directly just in case it doesn't need confirmation
    const loginRes = await supabase.auth.signInWithPassword({
        email,
        password
    });
    
    if (loginRes.error) {
        console.error('Login error:', loginRes.error);
        return;
    }
    
    console.log('Login successful, token:', loginRes.data.session.access_token.substring(0, 20) + '...');
  }
  
  const token = session ? session.access_token : ''; // handle undefined
}

test();
