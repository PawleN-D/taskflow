import { beforeAll, afterAll, afterEach } from 'vitest';
import { config } from 'dotenv';

config({ path: '.env.test' });

process.env.NODE_ENV = 'test';

if (!process.env.DATABASE_URL?.includes('test')) {
  throw new Error('Not using test database! Set DATABASE_URL to test database.');
}

beforeAll(async () => {
  console.log('🧪 Test suite starting...');
});

afterEach(async () => {
  // Clean up after each test
});

afterAll(async () => {
  console.log('✅ Test suite completed');
});