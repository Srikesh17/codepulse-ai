import { query } from '../config/db.js';

export class ActivityRepository {
  async logActivity(userId, eventType, metadata = {}) {
    // Sanitization: never log sensitive values
    const safeMetadata = { ...metadata };
    delete safeMetadata.password;
    delete safeMetadata.passwordHash;
    delete safeMetadata.token;
    delete safeMetadata.jwt;

    const res = await query(
      `INSERT INTO user_activity (user_id, event_type, metadata)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, event_type, metadata, created_at`,
      [userId, eventType, JSON.stringify(safeMetadata)]
    );
    return res.rows[0];
  }

  async getRecentActivityByUser(userId, limit = 10) {
    const res = await query(
      `SELECT id, user_id, event_type, metadata, created_at
       FROM user_activity
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return res.rows;
  }
}

export const activityRepository = new ActivityRepository();
