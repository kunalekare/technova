import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import { initSocketServer } from './socket/socketServer.js';

const PORT = process.env.PORT || 5000;

// Create HTTP server (Socket.io will attach in Phase 3)
const server = http.createServer(app);

// Initialize Socket.io
initSocketServer(server);

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    server.listen(PORT, () => {
      logger.success(`🚀 TechNova Server running on port ${PORT}`);
      logger.info(`📡 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🌐 Client URL: ${process.env.CLIENT_URL}`);
      logger.info(`📋 API Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

startServer();
