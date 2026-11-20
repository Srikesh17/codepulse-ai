import { userRepository } from '../repositories/user.repository.js';
import { statisticsRepository } from '../repositories/statistics.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';

export class DashboardService {
  async getOverview(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      err.isPublic = true;
      throw err;
    }

    const statistics = await statisticsRepository.getStatsByUserId(userId);

    return {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        preferredLanguage: user.preferred_language,
        learningGoal: user.learning_goal,
      },
      statistics: {
        problemsSolved: statistics.problemsSolved || 0,
        totalAttempts: statistics.totalAttempts || 0,
        hintsUsed: statistics.hintsUsed || 0,
        currentStreak: statistics.currentStreak || 0,
      },
    };
  }

  async getActivity(userId, limit = 10) {
    const rawEvents = await activityRepository.getRecentActivityByUser(userId, limit);

    return rawEvents.map((evt) => ({
      id: evt.id,
      eventType: evt.event_type,
      metadata: evt.metadata,
      createdAt: evt.created_at,
    }));
  }
}

export const dashboardService = new DashboardService();
