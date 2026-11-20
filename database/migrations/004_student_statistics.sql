-- Migration: 004_student_statistics.sql
-- Description: Create student statistics table for practice milestones and streaks

CREATE TABLE IF NOT EXISTS student_statistics (
  user_id UUID PRIMARY KEY
    REFERENCES users(id) ON DELETE CASCADE,
  problems_solved INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_practice_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
