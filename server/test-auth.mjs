import fetch from 'node-fetch';

const registerBody = JSON.stringify({
  name: 'Test User',
  email: 'testuser2@example.com',
  password: 'Test1234!'
});

const registerResp = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: registerBody,
});
console.log('register status:', registerResp.status);
console.log('register body:', await registerResp.text());

const loginBody = JSON.stringify({
  email: 'testuser2@example.com',
  password: 'Test1234!'
});
const loginResp = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: loginBody,
});
console.log('login status:', loginResp.status);
console.log('login body:', await loginResp.text());
