import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testChat() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test.dev@vitalis.com',
    password: 'TestPassword123!'
  });

  if (error) {
    console.error('Login error:', error);
    return;
  }

  const token = data.session.access_token;
  console.log('Logged in, got token.');

  try {
    const res = await fetch('http://localhost:5000/api/assistant/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: 'I have a mild headache' })
    });
    const json = await res.json();
    console.log('Response:', json);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testChat();
