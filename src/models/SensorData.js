import { Schema, model } from 'mongoose';


const sensorDataSchema = new Schema({
    temperature: Number,
    heartRate: Number,
    humidity: Number,
    activityLevel: String,
    timestamp: { type: Date, default: Date.now },
    synced: { type: Boolean, default: false }  // Track if data was synced to cloud
});

module.exports = model('SensorData', sensorDataSchema);