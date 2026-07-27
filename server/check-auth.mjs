const email = 'localuser@example.com';
const password = 'Pass1234!';

const registerResp = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Local User', email, password })
});

console.log('register status:', registerResp.status);
console.log('register body:', await registerResp.text());

const loginResp = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

console.log('login status:', loginResp.status);
console.log('login body:', await loginResp.text());
