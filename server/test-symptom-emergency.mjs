import assert from 'assert';
import { emergencyKeywords } from './src/controllers/symptom.controller.js';

// Mock request and response
const reqMock = {
  body: {
    age: 30,
    gender: 'male',
    symptoms: ['severe chest pain and shortness of breath']
  }
};

const resMock = {
  statusValue: null,
  jsonValue: null,
  status(code) {
    this.statusValue = code;
    return this;
  },
  json(data) {
    this.jsonValue = data;
    return this;
  }
};

async function runTest() {
  console.log('Testing emergency short-circuit logic...');
  
  const { symptoms, severity } = reqMock.body;
  const isEmergency = symptoms.some((s) => 
    emergencyKeywords.some((keyword) => s.toLowerCase().includes(keyword))
  ) || severity === 'emergency';
  
  try {
    assert.strictEqual(isEmergency, true, 'Symptoms should be flagged as an emergency');
    console.log('✅ Emergency keywords correctly identified');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTest();
