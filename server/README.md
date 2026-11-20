# CodePulse AI — Backend Server (Phase 2 Foundation)

Node.js & Express.js REST API service for CodePulse AI — Socratic Coding & Retention Coach.

## Features Implemented in Phase 2

- **Authentication System:**
  - Secure registration (`POST /api/auth/register`) with Zod input validation, 12-round bcrypt password hashing, automatic profile creation, and default statistics initialization.
  - Login (`POST /api/auth/login`) with credential verification and signed JWT issuance.
  - HttpOnly Cookie session storage (`codepulse_token`) with configurable `SameSite` and `Secure` flags.
  - Session restoration (`GET /api/auth/me`) for persistent authentication across browser refreshes.
  - Logout (`POST /api/auth/logout`) with cookie invalidation.
- **Student Profile Management:**
  - `GET /api/users/me` — Fetch full profile and account details.
  - `PATCH /api/users/me` — Update display name, preferred programming language, learning goal, and bio.
- **Connected Student Dashboard:**
  - `GET /api/dashboard/overview` — Real PostgreSQL-backed statistics (problems solved, total attempts, hints used, streak) initialized to zero for new accounts.
  - `GET /api/dashboard/activity` — Authenticated activity stream scoped strictly to the current user.
- **Security & Reliability:**
  - `helmet` security headers.
  - `cors` with credential support and origin validation.
  - `express-rate-limit` for authentication brute-force prevention.
  - CSRF verification on state-changing requests.
  - Centralized error handling and safe error responses.
  - Health check endpoint (`GET /api/health`).

## Running Locally

```bash
# 1. Install dependencies
cd server
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# 3. Run migrations
npm run migrate

# 4. Start development server
npm run dev

# 5. Run automated tests
npm test
```

## API Documentation

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Service health & database connectivity check |
| POST | `/api/auth/register` | Public | Create new student account (12-round bcrypt) |
| POST | `/api/auth/login` | Public | Authenticate user & issue HttpOnly JWT cookie |
| POST | `/api/auth/logout` | Required | Invalidate session cookie |
| GET | `/api/auth/me` | Required | Retrieve current authenticated user |
| GET | `/api/users/me` | Required | Retrieve student profile metadata |
| PATCH | `/api/users/me` | Required | Update display name, language, goal, bio |
| GET | `/api/dashboard/overview` | Required | Student statistics & account summary |
| GET | `/api/dashboard/activity` | Required | Scoped student audit & practice activity |
