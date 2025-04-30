import mongoose from 'mongoose';
import axios from 'axios';
import logger from './logger.js';

let currentDB = null;  // Tracks the currently connected DB URI

const connectDB = async () => {
  let targetDB = process.env.DATABASE_LOCAL;

  // Step 1: Check if Google is reachable
  try {
    const response = await axios.get('https://www.google.com');
    if (response.status === 200) {
      targetDB = process.env.DATABASE_CLOUD;
      logger.info('🌐 Google is reachable. Targeting MongoDB Atlas.');
    }
  } catch {
    logger.warn('⚠️ Google is NOT reachable. Falling back to Local MongoDB.');
  }

  // Step 2: Check if we're already connected to the desired DB
  if (mongoose.connection.readyState === 1 && currentDB === targetDB) {
    logger.info(`✅ Already connected to the correct DB: ${targetDB.includes('cloud') ? 'Cloud' : 'Local'}`);
    return;
  }

  // Step 3: If not connected or switching DBs, disconnect and reconnect
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info('🔌 Disconnected from previous MongoDB instance');
    }

    await mongoose.connect(targetDB);
    currentDB = targetDB;
    logger.info(`✅ Connected to ${targetDB.includes('cloud') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
  } catch (err) {
    logger.error('❌ Failed to connect to the selected MongoDB', err);
  }
};

export default connectDB;
