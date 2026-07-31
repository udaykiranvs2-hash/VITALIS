import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const { createUser } = await import('./src/utils/fallbackStore.js');
  console.log('Creating user in fallbackStore...');
  const res = await createUser({
    id: 'test-user-id-real',
    email: 'test-real@example.com',
    name: 'Test Real User',
    authProvider: 'email',
    profile: { fullName: 'Test Real User' }
  });
  console.log('Create result:', res);
}

test();
