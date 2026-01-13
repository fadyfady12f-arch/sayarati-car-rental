import { httpServer } from './app.js';
import { prisma } from './config/database.js';
import { redis } from './config/redis.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info('Connected to PostgreSQL database');

    // Test Redis connection
    await redis.ping();
    logger.info('Connected to Redis');

    // Start server
    httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
});

startServer();
