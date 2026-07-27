const url = 'http://localhost:5000/api/auth';

const randomEmail = `localuser-${Date.now()}@example.com`;
const password = 'Pass1234!';

const register = await fetch(`${url}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Local User', email: randomEmail, password }),
});
console.log('register status', register.status);
console.log('register text', await register.text());

const login = await fetch(`${url}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: randomEmail, password }),
});
console.log('login status', login.status);
console.log('login text', await login.text());
