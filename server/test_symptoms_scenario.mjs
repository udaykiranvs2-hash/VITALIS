import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const makeRequest = async (url, payload, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  
  return res.json();
};

async function run() {
  const email = `test12345@test.com`;
  const password = 'Test1234!';
  
  console.log('Attempting login via Supabase...');
  let { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  
  if (loginError) {
    console.log('Login failed, attempting to register...');
    const { data: regData, error: regError } = await supabase.auth.signUp({ email, password });
    if (regError) {
      console.error('Signup error:', regError);
      return;
    }
    console.log('Registration successful. Logging in...');
    const loginAttempt = await supabase.auth.signInWithPassword({ email, password });
    loginData = loginAttempt.data;
    loginError = loginAttempt.error;
    if (loginError) {
      console.error('Login error after signup:', loginError);
      return;
    }
  }
  
  const token = loginData.session.access_token;
  
  const scenarios = [
    {
      name: 'User Scenario - Trouble Breathing, Fever',
      payload: { 
        age: "19", 
        gender: 'male', 
        duration: "3-7 days", 
        severity: "moderate", 
        symptoms: ["Trouble Breathing", "Fever", "Cough", "Sneezing"], 
        medicalHistory: [], 
        allergies: [], 
        medications: [], 
        lifestyle: { activityLevel: "Sedentary", sleepHours: "7-9 hours", stressLevel: "Low", notes: "" } 
      }
    },
    {
      name: 'Emergency - Severe chest pain',
      payload: { age: 45, gender: 'male', symptoms: ['severe chest pain', 'shortness of breath'] }
    },
    {
      name: 'Mild - Headache',
      payload: { age: 25, gender: 'female', symptoms: ['mild headache'] }
    },
    {
      name: 'Moderate - Skin Rash',
      payload: { age: 30, gender: 'male', symptoms: ['itchy skin rash', 'redness'] }
    }
  ];
  
  for (const s of scenarios) {
    console.log(`\n--- Testing Scenario: ${s.name} ---`);
    console.log('Payload:', s.payload);
    const res = await makeRequest('http://localhost:5000/api/symptoms/assess', s.payload, token);
    console.log('Response:', JSON.stringify(res, null, 2));
  }
}

run().catch(console.error);
