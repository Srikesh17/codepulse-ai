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
         └── student_statistics (Problems Solved, Attempts, Hints, Streak)
```

### 2. Authentication Flow & Security Model

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
