import { sessionRepository } from '../repositories/session.repository.js';
import { problemRepository } from '../repositories/problem.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';
import { statisticsRepository } from '../repositories/statistics.repository.js';

export class SessionService {
  /**
   * Start or resume a practice session.
   * Returns { session, problem, draft, isNew }
   */
  async startOrResumeSession(userId, problemId) {
    // 1. Validate problem exists
    const problem = await problemRepository.findById(problemId);
    if (!problem) {
      const err = new Error('Problem not found.');
      err.status = 404;
      err.isPublic = true;
      throw err;
    }

    // 2. Look for an existing active/paused session
    const existing = await sessionRepository.findActiveSession(userId, problemId);

    if (existing) {
      // Resume
      await sessionRepository.updateLastActive(existing.id);
      await activityRepository.logActivity(userId, 'practice_session_resumed', {
        slug: problem.slug,
        sessionId: existing.id,
      });

      return {
        session: existing,
        problem,
        draft: {
          code: existing.code ?? problem.starter_code,
          version: existing.version ?? 0,
          language: existing.language ?? 'python',
        },
        isNew: false,
      };
    }

    // 3. Create new session
    const session = await sessionRepository.create(userId, problemId);

    // 4. Seed initial draft with starter code
    const { draft } = await sessionRepository.upsertDraft(
      session.id,
      problem.starter_code,
      0,
      'python'
    );

    await activityRepository.logActivity(userId, 'practice_session_started', {
      slug: problem.slug,
      sessionId: session.id,
    });

    return {
      session,
      problem,
      draft: {
        code: problem.starter_code,
        version: 1,
        language: 'python',
      },
      isNew: true,
    };
  }

  /**
   * Save (autosave) a code draft.
   * Returns the updated draft or throws 409 on version conflict.
   */
  async saveDraft(userId, sessionId, code, version, language = 'python') {
    // Verify session belongs to user
    await this._assertSessionOwner(userId, sessionId);

    const result = await sessionRepository.upsertDraft(sessionId, code, version, language);

    if (result.conflict) {
      const err = new Error(
        `Draft version conflict. Your version ${version} is behind stored version ${result.storedVersion}. Please reload.`
      );
      err.status = 409;
      err.isPublic = true;
      err.storedVersion = result.storedVersion;
      throw err;
    }

    await sessionRepository.updateLastActive(sessionId);
    return result.draft;
  }

  /**
   * Save a practice attempt snapshot.
   * Increments total_attempts (never problems_solved).
   */
  async createAttempt(userId, sessionId, code, attemptType, language = 'python') {
    // Verify session belongs to user
    const session = await this._assertSessionOwner(userId, sessionId);

    const attempt = await sessionRepository.createAttempt(
      sessionId,
      code,
      language,
      attemptType
    );

    // Increment total_attempts only
    if (attemptType === 'manual_snapshot') {
      await statisticsRepository.incrementTotalAttempts(userId);
    }

    await activityRepository.logActivity(userId, 'code_snapshot_saved', {
      sessionId,
      attemptId: attempt.id,
    });

    return attempt;
  }

  /**
   * Get a session (with ownership check).
   */
  async getSession(userId, sessionId) {
    return this._assertSessionOwner(userId, sessionId);
  }

  /**
   * Get all sessions for a user.
   */
  async getUserSessions(userId) {
    return sessionRepository.findByUserId(userId);
  }

  /**
   * Get attempts for a session (with ownership check).
   */
  async getAttempts(userId, sessionId) {
    await this._assertSessionOwner(userId, sessionId);
    return sessionRepository.getAttempts(sessionId);
  }

  // ─── Private ───────────────────────────────────────────────

  async _assertSessionOwner(userId, sessionId) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) {
      const err = new Error('Practice session not found.');
      err.status = 404;
      err.isPublic = true;
      throw err;
    }
    if (session.user_id !== userId) {
      const err = new Error('Access denied. This session belongs to a different user.');
      err.status = 403;
      err.isPublic = true;
      throw err;
    }
    return session;
  }
}

export const sessionService = new SessionService();
