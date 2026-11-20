# CodePulse AI — Socratic Coding & Retention Coach

> **"Stop Copying Solutions. Start Thinking Like an Engineer."**

CodePulse AI is a modern full-stack web platform designed to eliminate passive pattern memorization during technical interview preparation. Instead of dumping direct code solutions, CodePulse AI employs a structured Socratic methodology: asking diagnostic questions, probing algorithmic invariants, and guiding candidates to discover optimal solutions on their own for deep, durable recall.

---

## 🚀 Live Demo & Deployment Target

- **Frontend:** [Vercel](https://vercel.com)
- **Backend:** [Render](https://render.com)
- **Database:** [Supabase PostgreSQL](https://supabase.com)
- **Current Milestone:** **Phase 3 of 7** — Coding Problem Catalog, Monaco Editor, Practice Sessions, and Attempt Tracking.

---

## ✨ Features Implemented

### Phase 3: Coding Problem Catalog, Monaco Editor, and Practice Sessions
- **PostgreSQL Problem Catalog (`problems` table):**
  - Database schema (`database/migrations/005_problems.sql`) with difficulty checks, GIN indexing on topics array, and unique slug keys.
  - 13 original coding problems across core algorithmic patterns seeded via `database/seed_problems.js`.
  - Backend API: `GET /api/problems` (with search, difficulty, and topic filters) and `GET /api/problems/:slug`.
- **Practice Sessions & Code Persistence:**
  - `practice_sessions` table (`database/migrations/006_practice_sessions.sql`) tracking active, paused, and completed sessions.
  - `code_drafts` table (`database/migrations/007_code_drafts.sql`) with monotonic versioning for concurrency control.
  - `practice_attempts` table (`database/migrations/008_practice_attempts.sql`) storing manual snapshots as `not_evaluated`.
- **Autosave Engine & Custom Hook (`useCodeDraft`):**
  - 1.5-second debounced autosave on keystrokes.
  - Keyboard shortcut `Ctrl+S` / `Cmd+S` immediate flush.
  - Stale write detection: returns HTTP 409 Conflict when client version falls behind stored version.
  - Reset to starter code with confirmation dialog.
- **Frontend Integration:**
  - Modernized `ProblemsPage.jsx` and `PracticePage.jsx` connected to real backend APIs with graceful fallback.
  - Clear user messaging: Code execution clearly scheduled for Phase 5 sandbox; AI hints scheduled for Phase 4.
  - Resolved Phase 2 bugs: prevented demo user overwrite of real authenticated sessions, and handled 401 unauthenticated transitions smoothly.
- **Automated Verification:**
  - Comprehensive 25-test suite across Phase 2 and Phase 3 passing in Vitest.
  - Clean Vite production build with zero errors.

### Phase 2: Real Authentication & Student Profiles
- **Registration & Login:** Express REST APIs backed by Supabase PostgreSQL, bcryptjs (12 salt rounds), and JWT in HttpOnly cookies.
- **Session Hydration:** Persistent sessions via `GET /api/auth/me`.
- **Student Dashboard:** Real metrics, activity logging, and profile management.
- Automated test suite with 13 Vitest/Supertest tests passing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React.js 18 (Vite) |
| **Styling & Design System** | Tailwind CSS (Charcoal/Navy surfaces + Emerald accents) |
| **Routing & Auth Guards** | React Router DOM v6 + ProtectedRoute |
| **Backend Runtime** | Node.js + Express.js |
| **Database** | PostgreSQL (Supabase) with `pg` connection pool |
| **Authentication & Crypto** | JWT (HttpOnly Cookies), bcryptjs (12 salt rounds) |
| **Validation** | Zod |
| **Testing** | Vitest + Supertest |

---

## 📂 Project Structure

```text
codepulse-ai/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── PublicNavbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── ui/
│   │   │       ├── Badge.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── DemoNoticeBanner.jsx
│   │   │       └── Input.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authApi.js
│   │   │   ├── userApi.js
│   │   │   └── dashboardApi.js
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── dashboard.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── repositories/
│   │   │   ├── user.repository.js
│   │   │   ├── activity.repository.js
│   │   │   └── statistics.repository.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── dashboard.routes.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── user.service.js
│   │   │   └── dashboard.service.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   └── profile.validator.js
│   │   ├── app.js
│   │   └── index.js
│   ├── tests/
│   │   └── api.test.js
│   ├── .env.example
│   ├── package.json
│   └── vitest.config.js
├── database/
│   ├── migrations/
│   │   ├── 001_users.sql
│   │   ├── 002_user_profiles.sql
│   │   ├── 003_user_activity.sql
│   │   └── 004_student_statistics.sql
│   └── migrate.js
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PRD.md
│   └── ROADMAP.md
└── README.md
```

---

## ⚡ Local Setup Instructions

### 1. Prerequisites
- Node.js >= 18.0.0
- PostgreSQL database instance (or Supabase project)

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit server/.env with your DATABASE_URL and JWT_SECRET

# Run database migrations
npm run migrate

# Start development backend
npm run dev
# Server will run on http://localhost:3001
```

### 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
# Ensure VITE_API_BASE_URL=http://localhost:3001

# Start development client
npm run dev
# Client will open on http://localhost:3000
```

### 4. Running Backend Automated Tests
```bash
cd server
npm test
```

---

## 🌐 Deployment Instructions

### Backend: Render
1. Create a **Web Service** on Render connected to your repository.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `node src/index.js`
5. Configure Environment Variables:
   - `DATABASE_URL`: Your Supabase connection string.
   - `JWT_SECRET`: A secure 32+ character random secret.
   - `CLIENT_ORIGIN`: Your deployed frontend URL (e.g., `https://codepulse-ai.vercel.app`).
   - `NODE_ENV`: `production`
   - `COOKIE_SAMESITE`: `none` (Required for cross-site cookie transmission between Render & Vercel).
   - `COOKIE_SECURE`: `true` (HTTPS is required when SameSite is None).

### Frontend: Vercel
1. Import repository on Vercel.
2. Root Directory: `client`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure Environment Variables:
   - `VITE_API_BASE_URL`: Your Render backend URL (e.g., `https://codepulse-api.onrender.com`).

---

## 🗺️ Seven-Phase Roadmap

- [x] **Phase 1: Deployable Frontend & Monaco Workspace**
- [x] **Phase 2: Backend Foundation, Authentication & PostgreSQL** (Current)
- [ ] **Phase 3: Problem Catalog, Monaco Editor Integration & Practice Session Tracking**
- [ ] **Phase 4: Sandboxed Code Execution Engine**
- [ ] **Phase 5: Spaced-Repetition Retention Tracking**
- [ ] **Phase 6: End-to-End Testing & Hardening**
- [ ] **Phase 7: Production Release & CI/CD**
