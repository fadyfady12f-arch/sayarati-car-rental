import { Router } from 'express';
import authRoutes from './auth.routes.js';
import carsRoutes from './cars.routes.js';
import bookingsRoutes from './bookings.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/cars', carsRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/admin', adminRoutes);

export default router;
