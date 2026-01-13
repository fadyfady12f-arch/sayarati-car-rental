import { Router } from 'express';
import { BookingsController } from '../controllers/bookings.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { bookingValidator } from '../validators/booking.validator.js';
import { bookingLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();
const bookingsController = new BookingsController();

// Customer routes
router.get('/my-bookings', auth, bookingsController.getMyBookings);

router.post(
  '/',
  auth,
  bookingLimiter,
  validate(bookingValidator.create),
  bookingsController.create
);

router.get('/:id', auth, bookingsController.getById);

router.post(
  '/:id/cancel',
  auth,
  validate(bookingValidator.cancel),
  bookingsController.cancel
);

// Admin routes
router.get('/', auth, adminOnly, bookingsController.getAll);

router.post('/:id/confirm', auth, adminOnly, bookingsController.confirm);

router.post('/:id/reject', auth, adminOnly, bookingsController.reject);

router.post(
  '/:id/activate',
  auth,
  adminOnly,
  validate(bookingValidator.vehicleCondition),
  bookingsController.activate
);

router.post(
  '/:id/complete',
  auth,
  adminOnly,
  validate(bookingValidator.vehicleCondition),
  bookingsController.complete
);

export default router;
