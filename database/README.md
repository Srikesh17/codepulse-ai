# CodePulse AI — Database Schema & Migrations (Phase 2)

This directory is reserved for PostgreSQL schema definitions, migration scripts, and seed data, to be implemented in **Phase 2** of the CodePulse AI project roadmap.

## Planned Schema Entities

### 1. `users`
- `id` (UUID, Primary Key)
- `email` (VARCHAR(255), Unique, Indexed)
- `password_hash` (VARCHAR(255))
- `full_name` (VARCHAR(100))
- `avatar_url` (VARCHAR(255), Nullable)
- `role` (VARCHAR(20), Default 'student')
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

### 2. `problems`
- `id` (VARCHAR(50), Primary Key - slug)
- `title` (VARCHAR(150))
- `difficulty` (ENUM: 'Easy', 'Medium', 'Hard')
- `topic` (VARCHAR(50))
- `description` (TEXT)
- `starter_code` (TEXT)
- `test_cases` (JSONB)
- `created_at` (TIMESTAMP WITH TIME ZONE)

### 3. `submissions`
- `id` (UUID, Primary Key)
- `user_id` (UUID, References users.id)
- `problem_id` (VARCHAR(50), References problems.id)
- `code` (TEXT)
- `status` (ENUM: 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error')
- `runtime_ms` (INTEGER)
- `memory_kb` (INTEGER)
- `created_at` (TIMESTAMP WITH TIME ZONE)

### 4. `socratic_sessions` & `hints`
- `id` (UUID, Primary Key)
- `user_id` (UUID, References users.id)
- `problem_id` (VARCHAR(50), References problems.id)
- `hint_level` (SMALLINT: 1, 2, 3)
- `mode` (VARCHAR(20): 'socratic', 'direct')
- `prompt_context` (TEXT)
- `ai_response` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE)
