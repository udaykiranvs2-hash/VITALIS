import { writeFileSync } from 'fs';
import { spawn } from 'child_process';

const makeRequest = async (url, payload) => {
  const data = JSON.stringify(payload);
  const curl = spawn('curl.exe', ['-s', '-i', '-X', 'POST', url, '-H', 'Content-Type: application/json', '-d', data], { shell: true });

  let output = '';
  for await (const chunk of curl.stdout) {
    output += chunk;
  }
  for await (const chunk of curl.stderr) {
    output += chunk;
  }
  return new Promise((resolve) => curl.on('close', () => resolve(output)));
};

const run = async () => {
  const reg = await makeRequest('http://localhost:5000/api/auth/register', { name: 'Test User', email: 'testuser2@example.com', password: 'Test1234!' });
  console.log('REGISTER OUTPUT:\n', reg);
  const login = await makeRequest('http://localhost:5000/api/auth/login', { email: 'testuser2@example.com', password: 'Test1234!' });
  console.log('LOGIN OUTPUT:\n', login);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});