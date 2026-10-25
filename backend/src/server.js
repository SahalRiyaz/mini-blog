import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { setMongoActive, initializeSeedData } from './services/dbStore.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
export async function startServer() {
  const conn = await connectDB();
  setMongoActive(Boolean(conn));
  await initializeSeedData();

  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 Mini Blog Server running on port ${PORT}`);
      console.log(`📡 Base URL: http://localhost:${PORT}`);
      console.log(`=========================================`);
      resolve(server);
    });
  });
}

// Only auto-start if run directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer();
}

export default app;
