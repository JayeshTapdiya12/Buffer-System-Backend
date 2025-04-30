import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CLOUD,);
    logger.info('✅ Connected to MongoDB Atlas/ cloud data base');
  } catch (err) {
    logger.warn('⚠️ Atlas connection failed, falling back to Local MongoDB');

    try {
      await mongoose.connect(process.env.DATABASE_LOCAL);
      logger.info('✅ Connected to Local MongoDB (Buffer Storage)');
    } catch (localErr) {
      logger.error('❌ Failed to connect to any MongoDB', localErr);
      process.exit(1);
    }
  }
};

export default connectDB;
