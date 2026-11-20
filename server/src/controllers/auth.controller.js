import { authService } from '../services/auth.service.js';
import { env } from '../config/env.js';
import { COOKIE_NAME } from '../middleware/auth.middleware.js';

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAMESITE,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

export class AuthController {
  async register(req, res, next) {
    try {
      const { user, token } = await authService.register(req.body);

      res.cookie(COOKIE_NAME, token, getCookieOptions());

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { user, token } = await authService.login(req.body);

      res.cookie(COOKIE_NAME, token, getCookieOptions());

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      await authService.logout(req.user?.id);

      res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SAMESITE,
        path: '/',
      });

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
