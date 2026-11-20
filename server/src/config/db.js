import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

let pool = null;

export function getPool() {
  if (!pool) {
    if (!env.DATABASE_URL) {
      console.warn('⚠️  DATABASE_URL is not set. Database operations will fail unless configured.');
      return null;
    }

    const isSupabaseOrProd = env.NODE_ENV === 'production' || env.DATABASE_URL.includes('supabase');

    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: isSupabaseOrProd
        ? { rejectUnauthorized: false }
        : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('❌ Unexpected error on idle database client', err);
    });
  }
  return pool;
}

export async function query(text, params) {
  const p = getPool();
  if (!p) {
    throw new Error('Database connection not configured. Please set DATABASE_URL.');
  }
  const start = Date.now();
  const res = await p.query(text, params);
  const duration = Date.now() - start;
  if (env.NODE_ENV === 'development') {
    // console.log('executed query', { text, duration, rows: res.rowCount });
  }
  return res;
}

export async function getClient() {
  const p = getPool();
  if (!p) {
    throw new Error('Database connection not configured. Please set DATABASE_URL.');
  }
  return await p.connect();
}

export async function checkDatabaseHealth() {
  try {
    const p = getPool();
    if (!p) {
      return { status: 'unconfigured', message: 'DATABASE_URL is not set' };
    }
    const res = await p.query('SELECT 1 as healthy');
    return { status: 'connected', latencyMs: res.rowCount > 0 ? 1 : 0 };
  } catch (err) {
    return { status: 'error', message: err.message };
  }
}
