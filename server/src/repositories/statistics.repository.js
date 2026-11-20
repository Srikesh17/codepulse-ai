import { query } from '../config/db.js';

export class StatisticsRepository {
  async getStatsByUserId(userId) {
    const res = await query(
      `SELECT user_id, problems_solved, total_attempts, hints_used, current_streak, last_practice_date, updated_at
       FROM student_statistics
       WHERE user_id = $1`,
      [userId]
    );

    if (res.rows.length === 0) {
      return {
        problemsSolved: 0,
        totalAttempts: 0,
        hintsUsed: 0,
        currentStreak: 0,
        lastPracticeDate: null,
      };
    }

    const row = res.rows[0];
    return {
      problemsSolved: row.problems_solved,
      totalAttempts: row.total_attempts,
      hintsUsed: row.hints_used,
      currentStreak: row.current_streak,
      lastPracticeDate: row.last_practice_date,
    };
  }
}

export const statisticsRepository = new StatisticsRepository();
