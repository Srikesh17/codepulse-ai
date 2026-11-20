import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';

export class AuthService {
  generateToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  async register({ fullName, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 409;
      err.isPublic = true;
      throw err;
    }

    // 12 salt rounds as required
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await userRepository.createWithProfileAndStats({
      fullName,
      email,
      passwordHash,
    });

    // Audit log
    await activityRepository.logActivity(user.id, 'user_registered', {
      email: user.email,
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        createdAt: user.created_at,
      },
      token,
    };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      err.isPublic = true;
      throw err;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      err.isPublic = true;
      throw err;
    }

    // Audit log
    await activityRepository.logActivity(user.id, 'user_logged_in', {
      email: user.email,
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        createdAt: user.created_at,
      },
      token,
    };
  }

  async logout(userId) {
    if (userId) {
      await activityRepository.logActivity(userId, 'user_logged_out', {});
    }
    return { success: true };
  }

  async getMe(userId) {
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
}

export const authService = new AuthService();
