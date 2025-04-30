const express = require('express');
const router = express.Router();
const { saveSensorData } = require('../controllers/sensorController');


router.post('/sensor-data', saveSensorData);
router.get('/health-check', (req, res) => {
    res.status(200).send('OK');
});


module.exports = router;
