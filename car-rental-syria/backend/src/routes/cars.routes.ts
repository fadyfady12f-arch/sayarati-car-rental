import { Router } from 'express';
import { CarsController } from '../controllers/cars.controller.js';
import { auth, optionalAuth } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { carValidator } from '../validators/car.validator.js';
import { uploadImages } from '../middleware/upload.middleware.js';

const router = Router();
const carsController = new CarsController();

// Public routes
router.get('/', optionalAuth, carsController.getAll);
router.get('/featured', carsController.getFeatured);
router.get('/categories', carsController.getCategories);
router.get('/available', carsController.searchAvailable);
router.get('/:id', optionalAuth, carsController.getById);
router.get('/:id/reviews', carsController.getReviews);
router.post('/:id/check-availability', carsController.checkAvailability);

// Admin routes
router.post(
  '/',
  auth,
  adminOnly,
  uploadImages('images', 10),
  validate(carValidator.create),
  carsController.create
);

router.put(
  '/:id',
  auth,
  adminOnly,
  uploadImages('images', 10),
  validate(carValidator.update),
  carsController.update
);

router.delete('/:id', auth, adminOnly, carsController.delete);

router.patch('/:id/status', auth, adminOnly, carsController.updateStatus);

export default router;
