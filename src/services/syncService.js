import mongoose from 'mongoose';
import SensorData from '../models/SensorData.js';
import logger from '../config/logger.js';

let cloudConnection = null;

export const syncBufferedData = async () => {
    logger.info('⏳ Starting buffered data sync...');

    // 1. Get unsynced data from local DB
    const bufferedData = await SensorData.find({ synced: false });

    if (bufferedData.length === 0) {
        logger.info('✅ No unsynced data found. Buffer is clear.');
        return;
    }

    try {
        // 2. Establish a separate connection to the cloud DB
        if (!cloudConnection || cloudConnection.readyState !== 1) {
            cloudConnection = await mongoose.createConnection(process.env.DATABASE_CLOUD, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            logger.info('✅ Connected to Cloud DB for syncing');
        }

        // 3. Define a model on the cloud connection
        const CloudSensorData = cloudConnection.model('CloudSensorData', SensorData.schema);

        // 4. Sync each record
        for (const record of bufferedData) {
            try {
                await CloudSensorData.create({
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
