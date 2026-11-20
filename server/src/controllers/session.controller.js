import { sessionService } from '../services/session.service.js';
import { startSessionSchema, saveDraftSchema, createAttemptSchema } from '../validators/session.validator.js';

export const startSession = async (req, res, next) => {
  try {
    const parsed = startSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body.',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { session, problem, draft, isNew } = await sessionService.startOrResumeSession(
      req.user.id,
      parsed.data.problemId
    );

    res.status(isNew ? 201 : 200).json({
      success: true,
      data: {
        session: {
          id: session.id,
          status: session.status,
          startedAt: session.started_at,
          lastActiveAt: session.last_active_at,
        },
        problem: {
          id: problem.id,
          slug: problem.slug,
          title: problem.title,
          difficulty: problem.difficulty,
        },
        draft,
        isNew,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const sessions = await sessionService.getUserSessions(req.user.id);
    res.json({ success: true, data: sessions });
  } catch (err) {
    next(err);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const session = await sessionService.getSession(req.user.id, req.params.sessionId);
    res.json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};

export const saveDraft = async (req, res, next) => {
  try {
    const parsed = saveDraftSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid draft payload.',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { code, version, language } = parsed.data;
    const draft = await sessionService.saveDraft(
      req.user.id,
      req.params.sessionId,
      code,
      version,
      language
    );

    res.json({
      success: true,
      data: {
        version: draft.version,
        updatedAt: draft.updated_at,
      },
    });
  } catch (err) {
    if (err.status === 409) {
      return res.status(409).json({
        success: false,
        error: err.message,
        storedVersion: err.storedVersion,
      });
    }
    next(err);
  }
};

export const createAttempt = async (req, res, next) => {
  try {
    const parsed = createAttemptSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid attempt payload.',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { code, attemptType, language } = parsed.data;
    const attempt = await sessionService.createAttempt(
      req.user.id,
      req.params.sessionId,
      code,
      attemptType,
      language
    );

    res.status(201).json({ success: true, data: attempt });
  } catch (err) {
    next(err);
  }
};

export const getAttempts = async (req, res, next) => {
  try {
    const attempts = await sessionService.getAttempts(req.user.id, req.params.sessionId);
    res.json({ success: true, data: attempts });
  } catch (err) {
    next(err);
  }
};
