# CodePulse AI — Backend Server (Phase 2)

This directory is reserved for the Express.js REST API service, to be implemented in **Phase 2** of the CodePulse AI project roadmap.

## Planned Technology Stack

- **Runtime:** Node.js + Express.js
- **Language:** JavaScript / TypeScript
- **Authentication:** JWT (JSON Web Tokens) with HTTP-only cookies
- **Password Hashing:** `bcryptjs`
- **Validation:** `zod` schema validation
- **Database Client:** `pg` / Prisma ORM with connection pooling
- **AI Integration:** Google Gemini API SDK (`@google/genai`)

## Upcoming API Endpoints (Phase 2 & 3)

| Method | Endpoint | Description | Phase |
|---|---|---|---|
| POST | `/api/auth/register` | Create student account & hash password | Phase 2 |
| POST | `/api/auth/login` | Authenticate & issue secure session token | Phase 2 |
| GET | `/api/auth/me` | Retrieve authenticated profile | Phase 2 |
| GET | `/api/problems` | List problems with search & filters | Phase 2 |
| GET | `/api/problems/:id` | Fetch problem description, starter code & test cases | Phase 2 |
| POST | `/api/tutor/hint` | Generate Socratic hint via Gemini 2.5 Flash | Phase 3 |
| POST | `/api/execute` | Run sandboxed Python code against test suite | Phase 4 |
| GET | `/api/analytics` | Fetch student retention & hint trajectory metrics | Phase 5 |
