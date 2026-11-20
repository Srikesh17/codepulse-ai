-- Migration: 002_user_profiles.sql
-- Description: Create user profiles table for student preferences and metadata

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY
    REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  preferred_language VARCHAR(30) DEFAULT 'python',
  learning_goal VARCHAR(100),
  bio TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
