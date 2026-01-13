import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authValidator } from '../validators/auth.validator.js';
import { auth } from '../middleware/auth.middleware.js';
import { loginLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();
const authController = new AuthController();

router.post(
  '/register',
  validate(authValidator.register),
  authController.register
);

router.post(
  '/login',
  loginLimiter,
  validate(authValidator.login),
  authController.login
);

router.post('/logout', auth, authController.logout);

router.post('/refresh-token', authController.refreshToken);

router.post(
  '/forgot-password',
  validate(authValidator.forgotPassword),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  validate(authValidator.resetPassword),
  authController.resetPassword
);

router.post('/verify-email/:token', authController.verifyEmail);

router.get('/me', auth, authController.getProfile);

router.put(
  '/me',
  auth,
  validate(authValidator.updateProfile),
  authController.updateProfile
);

router.put(
  '/me/password',
  auth,
  validate(authValidator.changePassword),
  authController.changePassword
);

export default router;
