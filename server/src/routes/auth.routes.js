import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth, verifyCsrfProtection } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

// Rate limiter for auth endpoints (prevent credential brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

router.post(
  '/register',
  authLimiter,
  verifyCsrfProtection,
  validate(registerSchema),
  (req, res, next) => authController.register(req, res, next)
);

router.post(
  '/login',
  authLimiter,
  verifyCsrfProtection,
  validate(loginSchema),
  (req, res, next) => authController.login(req, res, next)
);

router.post(
  '/logout',
  requireAuth,
  verifyCsrfProtection,
  (req, res, next) => authController.logout(req, res, next)
);

router.get(
  '/me',
  requireAuth,
  (req, res, next) => authController.getMe(req, res, next)
);

export default router;
