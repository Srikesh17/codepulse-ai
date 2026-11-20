-- Phase 3: Practice Attempts (manual snapshots)
-- Migration: 008_practice_attempts.sql

CREATE TABLE IF NOT EXISTS practice_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  code_snapshot TEXT NOT NULL,
  language VARCHAR(30) NOT NULL DEFAULT 'python',
  attempt_type VARCHAR(30) NOT NULL
    CHECK (attempt_type IN ('manual_snapshot', 'evaluated_submission')),
  evaluation_status VARCHAR(30) NOT NULL DEFAULT 'not_evaluated',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_session_time
  ON practice_attempts(session_id, created_at DESC);
