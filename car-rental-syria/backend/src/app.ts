import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';

import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { generalLimiter } from './middleware/rateLimiter.middleware.js';
import { logger } from './utils/logger.js';
import { notificationService } from './services/notification.service.js';

const app: Application = express();
const httpServer = createServer(app);

// Socket.io setup
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Set io for notification service
notificationService.setIO(io);

// Socket.io connection handling
io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;

  if (userId) {
    socket.join(`user:${userId}`);
    logger.info(`User ${userId} connected to socket`);
  }

  socket.on('disconnect', () => {
    if (userId) {
      socket.leave(`user:${userId}`);
      logger.info(`User ${userId} disconnected from socket`);
    }
  });
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
app.use('/api', generalLimiter);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Static files
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

export { app, httpServer };
