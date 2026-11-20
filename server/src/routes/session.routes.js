import { Router } from 'express';
import { requireAuth, verifyCsrfProtection } from '../middleware/auth.middleware.js';
import {
  startSession,
  getSessions,
  getSession,
  saveDraft,
  createAttempt,
  getAttempts,
} from '../controllers/session.controller.js';

const router = Router();

// All session routes require authentication
router.use(requireAuth);

// POST /api/sessions — start or resume a session
router.post('/', verifyCsrfProtection, startSession);

// GET /api/sessions — list user's sessions
router.get('/', getSessions);

// GET /api/sessions/:sessionId
router.get('/:sessionId', getSession);

// PUT /api/sessions/:sessionId/draft — save (autosave) code draft
router.put('/:sessionId/draft', verifyCsrfProtection, saveDraft);

// POST /api/sessions/:sessionId/attempts — create attempt snapshot
router.post('/:sessionId/attempts', verifyCsrfProtection, createAttempt);

// GET /api/sessions/:sessionId/attempts
router.get('/:sessionId/attempts', getAttempts);

export default router;
