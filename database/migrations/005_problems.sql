-- Phase 3: Coding Problem Catalog
-- Migration: 005_problems.sql
-- Additive only — never drops existing tables

CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(160) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(20) NOT NULL
    CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topics TEXT[] NOT NULL DEFAULT '{}',
  constraints JSONB NOT NULL DEFAULT '[]'::jsonb,
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  starter_code TEXT NOT NULL,
  function_name VARCHAR(120),
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_problems_difficulty
  ON problems(difficulty);

CREATE INDEX IF NOT EXISTS idx_problems_topics
  ON problems USING GIN(topics);

CREATE INDEX IF NOT EXISTS idx_problems_published
  ON problems(is_published, created_at DESC);
