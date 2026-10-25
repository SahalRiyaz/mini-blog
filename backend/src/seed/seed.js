import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { setMongoActive, initializeSeedData } from '../services/dbStore.js';

dotenv.config();

async function runSeed() {
  console.log('[Seed] Starting database seed script...');
  const conn = await connectDB();
  setMongoActive(Boolean(conn));
  await initializeSeedData();
  console.log('[Seed] Completed successfully.');
  process.exit(0);
}

runSeed();
