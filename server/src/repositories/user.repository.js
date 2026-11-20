import { query, getClient } from '../config/db.js';

export class UserRepository {
  async findByEmail(email) {
    const res = await query(
      'SELECT id, full_name, email, password_hash, created_at, updated_at FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    return res.rows[0] || null;
  }

  async findById(id) {
    const res = await query(
      `SELECT u.id, u.full_name, u.email, u.created_at, u.updated_at,
              p.avatar_url, p.preferred_language, p.learning_goal, p.bio
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [id]
    );
    return res.rows[0] || null;
  }

  async createWithProfileAndStats({ fullName, email, passwordHash }) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // 1. Insert User
      const userRes = await client.query(
        `INSERT INTO users (full_name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, full_name, email, created_at, updated_at`,
        [fullName, email.toLowerCase(), passwordHash]
      );
      const user = userRes.rows[0];

      // 2. Insert Default Profile
      await client.query(
        `INSERT INTO user_profiles (user_id, preferred_language, learning_goal, bio)
         VALUES ($1, 'python', 'Master Algorithmic Patterns', '')`,
        [user.id]
      );

      // 3. Insert Default Statistics (all initialized to zero)
      await client.query(
        `INSERT INTO student_statistics (user_id, problems_solved, total_attempts, hints_used, current_streak)
         VALUES ($1, 0, 0, 0, 0)`,
        [user.id]
      );

      await client.query('COMMIT');
      return user;
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  }

  async updateProfile(userId, { fullName, preferredLanguage, learningGoal, bio }) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      if (fullName) {
        await client.query(
          `UPDATE users SET full_name = $1, updated_at = NOW() WHERE id = $2`,
          [fullName, userId]
        );
      }

      await client.query(
        `UPDATE user_profiles
         SET preferred_language = COALESCE($1, preferred_language),
             learning_goal = COALESCE($2, learning_goal),
             bio = COALESCE($3, bio),
             updated_at = NOW()
         WHERE user_id = $4`,
        [preferredLanguage, learningGoal, bio, userId]
      );

      await client.query('COMMIT');

      return await this.findById(userId);
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  }
}

export const userRepository = new UserRepository();
