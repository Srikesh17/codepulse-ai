import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { requireAuth, verifyCsrfProtection } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validators/profile.validator.js';

const router = Router();

router.get(
  '/me',
  requireAuth,
  (req, res, next) => userController.getProfile(req, res, next)
);

router.patch(
  '/me',
  requireAuth,
  verifyCsrfProtection,
  validate(updateProfileSchema),
  (req, res, next) => userController.updateProfile(req, res, next)
);

export default router;
