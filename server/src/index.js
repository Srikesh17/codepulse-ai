import app from './app.js';
import { env } from './config/env.js';
import { checkDatabaseHealth } from './config/db.js';

const PORT = env.PORT || 3001;

const server = app.listen(PORT, async () => {
  console.log(`\n=================================================`);
  console.log(`🚀 CodePulse AI Server running on port ${PORT}`);
  console.log(`📍 Environment:   ${env.NODE_ENV}`);
  console.log(`🌐 Allowed Origin: ${env.CLIENT_ORIGIN}`);
  console.log(`=================================================`);

  const dbHealth = await checkDatabaseHealth();
  if (dbHealth.status === 'connected') {
    console.log(`✅ Database: Connected to PostgreSQL`);
  } else if (dbHealth.status === 'unconfigured') {
    console.log(`⚠️  Database: DATABASE_URL not set (in-memory test / pending config)`);
  } else {
    console.warn(`⚠️  Database Warning:`, dbHealth.message);
  }
  console.log(`=================================================\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
