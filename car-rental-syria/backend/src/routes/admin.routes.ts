import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/role.middleware.js';

const router = Router();
const adminController = new AdminController();

// All routes require admin authentication
router.use(auth, adminOnly);

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/revenue', adminController.getRevenueStats);
router.get('/dashboard/bookings-stats', adminController.getBookingsStats);
router.get('/dashboard/recent-bookings', adminController.getRecentBookings);
router.get('/dashboard/alerts', adminController.getSystemAlerts);

router.get('/activity-logs', adminController.getActivityLogs);

router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

export default router;
