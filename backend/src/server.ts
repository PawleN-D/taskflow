import { app } from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './db/connection.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();