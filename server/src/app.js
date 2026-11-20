import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { checkDatabaseHealth } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

export function createApp() {
  const app = express();

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS configuration
  const allowedOrigins = [
    env.CLIENT_ORIGIN,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://codepulse-ai.vercel.app',
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.some((allowed) => {
          if (allowed.includes('*')) {
            const regex = new RegExp(`^${allowed.replace('*', '.*')}$`);
            return regex.test(origin);
          }
          return allowed === origin;
        });

        if (isAllowed || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
          callback(null, true);
        } else {
          callback(new Error(`CORS error: Origin ${origin} not allowed.`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-CodePulse-Client',
      ],
      exposedHeaders: ['Set-Cookie'],
    })
  );

  // Body and cookie parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    const dbHealth = await checkDatabaseHealth();
    const isHealthy = dbHealth.status === 'connected' || dbHealth.status === 'unconfigured';

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'degraded',
      service: 'codepulse-ai-server',
      version: '1.0.0',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbHealth,
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // 404 & Central Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp();
