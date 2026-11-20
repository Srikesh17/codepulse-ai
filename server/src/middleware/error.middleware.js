import { env } from '../config/env.js';

export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  
  // Basic structured logging
  console.error(`[ERROR ${statusCode}] ${req.method} ${req.originalUrl}:`, {
    message: err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  const response = {
    success: false,
    error: err.isPublic || statusCode < 500
      ? err.message
      : 'An unexpected internal server error occurred.',
  };

  if (env.NODE_ENV === 'development') {
    response.debug = {
      message: err.message,
      stack: err.stack,
    };
  }

  res.status(statusCode).json(response);
}
