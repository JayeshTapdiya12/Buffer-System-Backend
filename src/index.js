import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routes from './routes';
import connectLocalDB from './config/database';
import {
  appErrorHandler,
  genericErrorHandler,
  notFound
} from './middlewares/error.middleware';
import logger, { logStream } from './config/logger';
import morgan from 'morgan';
import { syncBufferedData } from './services/syncService';  // Periodic sync service

const app = express();
const host = process.env.APP_HOST;
const port = process.env.APP_PORT;
const api_version = process.env.API_VERSION;

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('combined', { stream: logStream }));

// Connect to Local MongoDB (Buffer Storage)
connectLocalDB();

app.get('/api/v1/health-check', (req, res) => {
  res.status(200).json({ message: 'Local Buffer Backend is reachable' });
});

app.use(`/api/${api_version}`, routes());
app.use(appErrorHandler);
app.use(genericErrorHandler);
app.use(notFound);

// Start periodic sync process for buffered data (every 5 minutes)
setInterval(() => {
  console.log("🔄 Running periodic sync...");
  syncBufferedData();
}, 5 * 60 * 1000);  // Every 5 minutes

app.listen(port, () => {
  logger.info(`Server started at ${host}:${port}/api/${api_version}/`);
});

export default app;
