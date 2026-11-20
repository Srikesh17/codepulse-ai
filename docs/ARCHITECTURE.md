# System Architecture
## CodePulse AI — Socratic Coding & Retention Coach

### 1. High-Level Architecture (Phase 2 Full Stack)

```
[ Client: React 18 + Vite + Tailwind CSS ]
         │
         ├─── Monaco Code Editor (Browser IDE)
         ├─── Recharts Analytics Dashboard
         ├─── AuthContext (HttpOnly Cookie Session Restoration)
         └─── ProtectedRoute (Route Guard)
         │
         ▼  (HTTPS / REST with Credentials)
[ Backend: Node.js + Express.js ]
         │
         ├─── Security Middleware (Helmet, CORS, Rate Limiting, CSRF)
         ├─── Auth Service (Bcrypt 12 Rounds, JWT in HttpOnly Cookie)
         ├─── User Service (Profile Management & Preferences)
         ├─── Dashboard Service (Overview Statistics & Scoped Activity)
         └─── Database Connection Pool (`pg` with SSL)
         │
         ▼
[ Persistence: Supabase-Hosted PostgreSQL Database ]
         ├── users (UUID, Email, Password Hash)
         ├── user_profiles (Languages, Learning Goals, Bio)
         ├── user_activity (Audit Logs & Practice Stream)
         ├── student_statistics (Problems Solved, Attempts, Hints, Streak)
         ├── problems (Slug, Title, Difficulty, Topics, Starter Code, Constraints)
         ├── practice_sessions (User, Problem, Status, Active Timestamps)
         ├── code_drafts (Session ID, Code, Monotonic Version, Language)
         └── practice_attempts (Session ID, Snapshot, Type, Evaluation Status)
```

### 2. Practice Sessions, Autosave & Concurrency Model (Phase 3)

1. **Problem Catalog Access:**
   - Client queries `GET /api/problems?search=&difficulty=&topic=&page=&limit=`.
   - Results are filtered and indexed (GIN indexing on `topics`, B-tree on `difficulty`).
2. **Session Lifecycle:**
   - Starting a practice problem issues `POST /api/sessions` with `{ problemId }`.
   - Idempotent: returns existing active/paused session if one exists, or creates a new session seeded with the problem's starter code at `version = 1`.
3. **Autosave Engine (`useCodeDraft`):**
   - Keystrokes in Monaco trigger a 1.5-second debounced autosave via `PUT /api/sessions/:sessionId/draft`.
   - Explicit saves via `Ctrl+S` / `Cmd+S` bypass debounce and immediately flush.
   - Optimistic concurrency control: if the client's submitted version is lower than the stored version, backend returns `409 Conflict`, guarding against multi-tab race conditions.
4. **Manual Attempt Snapshots:**
   - Submissions trigger `POST /api/sessions/:sessionId/attempts` with `attemptType: 'manual_snapshot'`.
   - Stored with `evaluation_status: 'not_evaluated'`.
   - Increments `student_statistics.total_attempts` while guaranteeing `problems_solved` remains strictly at `0` until code execution verification is added in Phase 5.

### 3. Authentication Flow & Security Model

1. **Registration:**
   - Client sends `fullName`, `email`, `password` to `POST /api/auth/register`.
   - Backend validates body with Zod, normalizes email, checks uniqueness.
   - Password is salted and hashed using bcrypt with 12 rounds.
   - User, profile, and default zero-statistics records are inserted atomically within a single SQL transaction.
   - Signed JWT is set into an `HttpOnly` cookie (`SameSite=lax/none`, `Secure` in production).
2. **Session Restoration:**
   - On page reload, the client triggers `GET /api/auth/me`.
   - The cookie is automatically forwarded with `credentials: 'include'`.
   - The server verifies the token, queries PostgreSQL, and returns current user metadata.
3. **Logout:**
   - Client triggers `POST /api/auth/logout`.
   - Server clears the cookie with matching attributes and logs the activity event.
