import { createUser, findUserById } from './src/utils/fallbackStore.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const dummyUser = {
    id: 'test-user-id-1234',
    email: 'test@example.com',
    name: 'Test User',
    authProvider: 'email',
    profile: { fullName: 'Test User' }
  };
  
  console.log('Creating user in fallbackStore...');
  const res = await createUser(dummyUser);
  console.log('Create result:', res);
  
  console.log('Finding user...');
  const found = await findUserById('test-user-id-1234');
  console.log('Find result:', found);
}

test();
