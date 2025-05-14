import mongoose from 'mongoose';
import axios from 'axios';
import logger from './logger.js';

let currentDB = null;

const connectTo = async (uri, label) => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('🔌 Disconnected from previous MongoDB instance');
  }

  try {
    await mongoose.connect(uri);
    currentDB = uri;
    logger.info(`✅ Connected to ${label}`);
  } catch (err) {
    logger.error(`❌ Failed to connect to ${label}`, err);
  }
};

export const connectDB = async () => {
  let targetDB = process.env.DATABASE_LOCAL;
  let label = 'Local MongoDB';

  try {
    const response = await axios.get('https://www.google.com');
    if (response.status === 200) {
      targetDB = process.env.DATABASE_CLOUD;
      label = 'MongoDB Atlas (Cloud)';
      logger.info('🌐 Google is reachable. Using Cloud DB');
    }
  } catch {
    logger.warn('⚠️ Google unreachable. Using Local DB');
  }

  if (mongoose.connection.readyState === 1 && currentDB === targetDB) {
    logger.info(`✅ Already connected to correct DB: ${label}`);
    return;
  }

  await connectTo(targetDB, label);
};

export const connectLocalOnly = async () => {
  await connectTo(process.env.DATABASE_LOCAL, 'Local MongoDB (Forced)');
};

export const connectCloudOnly = async () => {
  await connectTo(process.env.DATABASE_CLOUD, 'MongoDB Atlas (Cloud - Forced)');
};
