import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/miniblog';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.warn(`[Database Note] To use MongoDB, ensure local MongoDB is running or set MONGODB_URI in .env (e.g. MongoDB Atlas connection string).`);
    // Do not crash server immediately, allowing healthcheck & clear status
    return null;
  }
}
