import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/taskflow';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.db?.databaseName);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
}

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

export { mongoose };