import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.repository.js';

export const COOKIE_NAME = 'codepulse_token';

export async function requireAuth(req, res, next) {
  try {
    // 1. Extract token from HttpOnly cookie or Authorization Bearer header
    let token = req.cookies?.[COOKIE_NAME];
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. No session found.',
      });
    }

    // 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        error: 'Session expired or invalid. Please log in again.',
      });
    }

    if (!decoded.sub) {
      return res.status(401).json({
        success: false,
        error: 'Invalid session payload.',
      });
    }

    // 3. Fetch user from DB to ensure user still exists and get latest profile
    const user = await userRepository.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account not found.',
      });
    }

    // 4. Attach user to request
    req.user = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      avatarUrl: user.avatar_url,
      preferredLanguage: user.preferred_language,
      learningGoal: user.learning_goal,
      bio: user.bio,
      createdAt: user.created_at,
    };

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * CSRF mitigation for state-changing requests using cookie authentication
 */
export function verifyCsrfProtection(req, res, next) {
  // Safe HTTP methods don't need CSRF validation
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // If authenticated via Bearer token (not cookie), CSRF is not applicable
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return next();
  }

  const origin = req.headers.origin || req.headers.referer;
  const customHeader = req.headers['x-codepulse-client'] || req.headers['x-requested-with'];

  // In development, allow localhost variations
  if (env.NODE_ENV === 'development') {
    return next();
  }

  // If a custom header is present, browser preflight stops cross-origin form forgery
  if (customHeader) {
    return next();
  }

  // Origin verification
  if (origin && env.CLIENT_ORIGIN && !origin.startsWith(env.CLIENT_ORIGIN)) {
    return res.status(403).json({
      success: false,
      error: 'Cross-site request blocked by CSRF policy',
    });
  }

  next();
}
