import "dotenv/config";
import { assessSymptoms } from './src/controllers/symptom.controller.js';

const mockRes = () => {
  const res = {};
  res.status = function(code) {
    this.statusCode = code;
    return this;
  };
  res.json = function(data) {
    this.data = data;
    return this;
  };
  return res;
};

const scenarios = [
  {
    name: 'Emergency - Severe chest pain',
    body: { age: 45, gender: 'male', symptoms: ['severe chest pain', 'shortness of breath'] }
  },
  {
    name: 'Mild - Headache',
    body: { age: 25, gender: 'female', symptoms: ['mild headache', 'has been present for 2 hours'] }
  },
  {
    name: 'Moderate - Skin Rash',
    body: { age: 30, gender: 'male', symptoms: ['itchy skin rash', 'redness all over the arm'] }
  },
  {
    name: 'Needs Follow-up - Vague symptoms',
    body: { age: 50, gender: 'female', symptoms: ['I feel unwell and tired all the time'] }
  }
];

async function run() {
  // Wait a moment for AI services to initialize asynchronously if any
  await new Promise(r => setTimeout(r, 2000));

  for (const s of scenarios) {
    console.log(`\n======================================================`);
    console.log(`--- Testing Scenario: ${s.name} ---`);
    console.log('Payload:', s.body);
    const req = { body: s.body, userId: 'test-user-id' };
    const res = mockRes();
    await assessSymptoms(req, res);
    console.log('\nStatus Code:', res.statusCode);
    console.log('Response:\n', JSON.stringify(res.data, null, 2));
  }
  process.exit(0);
}

run().catch(console.error);
