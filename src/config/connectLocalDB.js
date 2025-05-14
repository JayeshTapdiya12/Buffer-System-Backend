import mongoose from 'mongoose';
import logger from './logger.js';

const connectLocalDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_LOCAL);
        logger.info('✅ Connected to Local MongoDB');
    } catch (err) {
        logger.error('❌ Failed to connect to Local MongoDB', err);
    }
};

export default connectLocalDB;
