import { beforeAll, afterAll, afterEach } from 'vitest';
import { config } from 'dotenv';
import { connectDB, disconnectDB, mongoose } from '../src/db/connection.js';

config({ path: '.env.test' });

beforeAll(async () => {
  console.log('🧪 Test suite starting...');
  await connectDB();
});

afterEach(async () => {
  // Clean all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  console.log('✅ Test suite completed');
  await disconnectDB();
});
