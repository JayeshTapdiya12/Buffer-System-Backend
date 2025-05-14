import mongoose from 'mongoose';
import logger from './logger.js';

const connectCloudDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_CLOUD);
        logger.info('✅ Connected to MongoDB Atlas (Cloud)');
    } catch (err) {
        logger.error('❌ Failed to connect to MongoDB Atlas', err);
    }
};

export default connectCloudDB;
