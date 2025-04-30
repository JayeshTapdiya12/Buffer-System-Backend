// import SensorData from '../models/SensorData.js';
const SensorData = require('../models/SensorData');

import mongoose from 'mongoose';

const CloudSensorData = mongoose.model('CloudSensorData', SensorData.schema);

export const syncBufferedData = async () => {




    console.log('⏳ Starting buffered data sync...');

    const bufferedData = await SensorData.find({ synced: false });

    if (bufferedData.length === 0) {
        console.log('✅ No unsynced data found. Buffer is clear.');
        return;
    }

    for (const record of bufferedData) {
        try {
            await CloudSensorData.create({
                temperature: record.temperature,
                heartRate: record.heartRate,
                humidity: record.humidity,
                activityLevel: record.activityLevel,
                timestamp: record.timestamp
            });

            await SensorData.findByIdAndUpdate(record._id, { synced: true });
            console.log(`✅ Record ${record._id} synced successfully.`);
        } catch (err) {
            console.error(`❌ Error syncing record ${record._id}:`, err.message);
        }
    }

    console.log('🔄 Buffered data sync completed.');
};
