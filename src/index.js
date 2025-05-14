import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routes from './routes/index.js';
import { connectDB } from './config/database.js';
import {
  appErrorHandler,
  genericErrorHandler,
  notFound
} from './middlewares/error.middleware.js';
import logger, { logStream } from './config/logger.js';
import morgan from 'morgan';
import { syncBufferedData } from './services/syncService.js';

const app = express();
const host = process.env.APP_HOST;
const port = process.env.APP_PORT;
const api_version = process.env.API_VERSION;

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('combined', { stream: logStream }));

// Check DB periodically
setInterval(() => {
  connectDB();
}, 10 * 1000);

// Health Check
app.get('/api/v1/health-check', (req, res) => {
  res.status(200).json({ message: 'Local Buffer Backend is reachable' });
});

app.use(`/api/${api_version}`, routes());
app.use(appErrorHandler);
app.use(genericErrorHandler);
app.use(notFound);

// Sync every 30s (can increase to 5m later)
setInterval(() => {
  console.log('🔄 Running periodic sync...');
  syncBufferedData();
}, 30 * 1000);

app.listen(port, () => {
  logger.info(`Server started at ${host}:${port}/api/${api_version}/`);
});

export default app;
