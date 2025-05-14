import mongoose from 'mongoose';
import SensorData from '../models/SensorData.js';
import logger from '../config/logger.js';
import { connectLocalOnly } from '../config/database.js';

let cloudConnection = null;

export const syncBufferedData = async () => {
    logger.info('⏳ Starting buffered data sync...');

    // Connect to local DB to read unsynced data
    await connectLocalOnly();

    const bufferedData = await SensorData.find({ synced: false });

    if (bufferedData.length === 0) {
        logger.info('✅ No unsynced data found. Buffer is clear.');
        return;
    }

    try {
        if (!cloudConnection || cloudConnection.readyState !== 1) {
            cloudConnection = await mongoose.createConnection(process.env.DATABASE_CLOUD, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            logger.info('✅ Connected to Cloud DB for syncing');
        }

        const SensorDatas = cloudConnection.model('SensorDatas', SensorData.schema);

        for (const record of bufferedData) {
            try {
                await SensorDatas.create({
                    _id: record._id,
                    temperature: record.temperature,
                    heartRate: record.heartRate,
                    humidity: record.humidity,
                    activityLevel: record.activityLevel,
                    timestamp: record.timestamp,
                });

                await SensorData.findByIdAndUpdate(record._id, { synced: true });
                logger.info(`✅ Record ${record._id} synced successfully.`);
            } catch (err) {
                logger.error(`❌ Error syncing record ${record._id}: ${err.message}`);
            }
        }

        logger.info('🔄 Buffered data sync completed.');
    } catch (e) {
        logger.error('❌ Failed to sync buffered data to cloud', e);
    }
};
