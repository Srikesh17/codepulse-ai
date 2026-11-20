import { userRepository } from '../repositories/user.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';

export class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      err.isPublic = true;
      throw err;
    }

    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      avatarUrl: user.avatar_url,
      preferredLanguage: user.preferred_language,
      learningGoal: user.learning_goal,
      bio: user.bio,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async updateProfile(userId, updates) {
    const updated = await userRepository.updateProfile(userId, updates);
    if (!updated) {
      const err = new Error('Failed to update profile.');
      err.statusCode = 400;
      err.isPublic = true;
      throw err;
    }

    await activityRepository.logActivity(userId, 'user_profile_updated', {
      fields: Object.keys(updates).filter(k => updates[k] !== undefined),
    });

    return {
      id: updated.id,
      fullName: updated.full_name,
      email: updated.email,
      avatarUrl: updated.avatar_url,
      preferredLanguage: updated.preferred_language,
      learningGoal: updated.learning_goal,
      bio: updated.bio,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };
  }
}

export const userService = new UserService();
