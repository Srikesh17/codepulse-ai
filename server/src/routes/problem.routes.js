import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { listProblems, getProblem } from '../controllers/problem.controller.js';

const router = Router();

// All problem routes require authentication
router.use(requireAuth);

// GET /api/problems?search=&difficulty=easy&topic=Arrays&page=1&limit=20
router.get('/', listProblems);

// GET /api/problems/:slug
router.get('/:slug', getProblem);

export default router;
