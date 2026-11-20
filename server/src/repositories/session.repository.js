import { query, getClient } from '../config/db.js';

export class SessionRepository {
  // ─── Sessions ──────────────────────────────────────────────

  async findActiveSession(userId, problemId) {
    const res = await query(
      `SELECT ps.*, cd.code, cd.version, cd.language, cd.updated_at AS draft_updated_at
       FROM practice_sessions ps
       LEFT JOIN code_drafts cd ON cd.session_id = ps.id
       WHERE ps.user_id = $1
         AND ps.problem_id = $2
         AND ps.status IN ('active', 'paused')
       ORDER BY ps.last_active_at DESC
       LIMIT 1`,
      [userId, problemId]
    );
    return res.rows[0] || null;
  }

  async create(userId, problemId) {
    const res = await query(
      `INSERT INTO practice_sessions (user_id, problem_id, status, started_at, last_active_at)
       VALUES ($1, $2, 'active', NOW(), NOW())
       RETURNING *`,
      [userId, problemId]
    );
    return res.rows[0];
  }

  async findById(sessionId) {
    const res = await query(
      `SELECT ps.*, cd.code, cd.version, cd.language, cd.updated_at AS draft_updated_at
       FROM practice_sessions ps
       LEFT JOIN code_drafts cd ON cd.session_id = ps.id
       WHERE ps.id = $1`,
      [sessionId]
    );
    return res.rows[0] || null;
  }

  async findByUserId(userId, limit = 20) {
    const res = await query(
      `SELECT ps.id, ps.problem_id, ps.status, ps.started_at, ps.last_active_at,
              p.slug, p.title, p.difficulty
       FROM practice_sessions ps
       JOIN problems p ON p.id = ps.problem_id
       WHERE ps.user_id = $1
       ORDER BY ps.last_active_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return res.rows;
  }

  async updateLastActive(sessionId) {
    await query(
      `UPDATE practice_sessions SET last_active_at = NOW() WHERE id = $1`,
      [sessionId]
    );
  }

  // ─── Drafts ────────────────────────────────────────────────

  /**
   * Upsert a code draft.
   * Returns { conflict: true } if the submitted version is behind the stored version.
   */
  async upsertDraft(sessionId, code, incomingVersion, language = 'python') {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Lock the existing draft row (if any)
      const existing = await client.query(
        `SELECT version FROM code_drafts WHERE session_id = $1 FOR UPDATE`,
        [sessionId]
      );

      if (existing.rows.length > 0) {
        const storedVersion = existing.rows[0].version;
        // Version conflict: reject stale writes
        if (incomingVersion < storedVersion) {
          await client.query('ROLLBACK');
          return { conflict: true, storedVersion };
        }

        // Update
        const res = await client.query(
          `UPDATE code_drafts
           SET code = $1, version = $2, language = $3, updated_at = NOW()
           WHERE session_id = $4
           RETURNING *`,
          [code, storedVersion + 1, language, sessionId]
        );
        await client.query('COMMIT');
        return { conflict: false, draft: res.rows[0] };
      } else {
        // Insert first draft
        const res = await client.query(
          `INSERT INTO code_drafts (session_id, code, version, language, updated_at)
           VALUES ($1, $2, 1, $3, NOW())
           RETURNING *`,
          [sessionId, code, language]
        );
        await client.query('COMMIT');
        return { conflict: false, draft: res.rows[0] };
      }
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getDraft(sessionId) {
    const res = await query(
      `SELECT * FROM code_drafts WHERE session_id = $1`,
      [sessionId]
    );
    return res.rows[0] || null;
  }

  // ─── Attempts ──────────────────────────────────────────────

  async createAttempt(sessionId, codeSnapshot, language, attemptType) {
    const res = await query(
      `INSERT INTO practice_attempts (session_id, code_snapshot, language, attempt_type, evaluation_status)
       VALUES ($1, $2, $3, $4, 'not_evaluated')
       RETURNING id, session_id, language, attempt_type, evaluation_status, created_at`,
      [sessionId, codeSnapshot, language, attemptType]
    );
    return res.rows[0];
  }

  async getAttempts(sessionId) {
    const res = await query(
      `SELECT id, session_id, language, attempt_type, evaluation_status, created_at
       FROM practice_attempts
       WHERE session_id = $1
       ORDER BY created_at DESC`,
      [sessionId]
    );
    return res.rows;
  }
}

export const sessionRepository = new SessionRepository();
