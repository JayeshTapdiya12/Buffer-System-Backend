const SensorData = require('../models/SensorData');

const saveSensorData = async (req, res) => {
    const { temperature, heartRate, humidity, activityLevel } = req.body;

    const data = { temperature, heartRate, humidity, activityLevel, timestamp: new Date() };

    try {
        const newSensorData = new SensorData(data);
        await newSensorData.save();
        res.status(200).json({ message: 'Data saved to active MongoDB (Atlas or Local)' });
    } catch (err) {
        console.error('Error saving data:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { saveSensorData };
