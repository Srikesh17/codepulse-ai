import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server/.env if available
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const { Pool } = pg;

export async function runMigrations(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    console.error('Migration error: DATABASE_URL is not set.');
    return { success: false, error: 'DATABASE_URL is not set' };
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' || databaseUrl.includes('supabase')
      ? { rejectUnauthorized: false }
      : false,
  });

  const client = await pool.connect();
  try {
    console.log('🔄 Checking database connection and running migrations...');

    // Migration tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
      const alreadyApplied = await client.query(
        'SELECT 1 FROM schema_migrations WHERE migration_name = $1',
        [file]
      );

      if (alreadyApplied.rowCount > 0) {
        console.log(`⏭️  Already applied: ${file}`);
        continue;
      }

      console.log(`▶️  Applying: ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        'INSERT INTO schema_migrations (migration_name) VALUES ($1)',
        [file]
      );
      await client.query('COMMIT');
      console.log(`✅ Applied: ${file}`);
    }

    console.log('🎉 All migrations applied successfully!');
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// Auto-run when executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
