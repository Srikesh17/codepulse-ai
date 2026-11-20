# CodePulse AI — Database Schema & Migrations

PostgreSQL relational database schema for CodePulse AI. Hosted on Supabase / PostgreSQL.

## Migration Files (`database/migrations/`)

1. `001_users.sql` — `users` table for primary authentication, passwords, and identity.
2. `002_user_profiles.sql` — `user_profiles` table for preferred languages, learning goals, and bios.
3. `003_user_activity.sql` — `user_activity` table for event logging and user audit trails with compound indexing.
4. `004_student_statistics.sql` — `student_statistics` table for tracking solved problems, attempts, hints, and streaks.

## Running Migrations

```bash
# From project root
node database/migrate.js

# Or from server directory
cd server
npm run migrate
```

The migration runner ensures idempotency: migrations are recorded in `schema_migrations` and only unapplied migrations run.
