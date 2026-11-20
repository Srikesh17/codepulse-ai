import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get(
  '/overview',
  requireAuth,
  (req, res, next) => dashboardController.getOverview(req, res, next)
);

router.get(
  '/activity',
  requireAuth,
  (req, res, next) => dashboardController.getActivity(req, res, next)
);

export default router;
