-- Migration: 001_users.sql
-- Description: Create users table for authentication and identity

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on email for fast lookups during login/registration
CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
