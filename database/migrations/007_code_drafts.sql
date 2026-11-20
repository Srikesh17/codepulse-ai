-- Phase 3: Code Drafts (autosave)
-- Migration: 007_code_drafts.sql

CREATE TABLE IF NOT EXISTS code_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE REFERENCES practice_sessions(id) ON DELETE CASCADE,
  language VARCHAR(30) NOT NULL DEFAULT 'python',
  code TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drafts_session
  ON code_drafts(session_id);
