# CodePulse AI — Socratic Coding & Retention Coach

> **"Stop Copying Solutions. Start Thinking Like an Engineer."**

CodePulse AI is a modern full-stack web platform designed to eliminate passive pattern memorization during technical interview preparation. Instead of dumping direct code solutions, CodePulse AI employs a structured Socratic methodology: asking diagnostic questions, probing algorithmic invariants, and guiding candidates to discover optimal solutions on their own for deep, durable recall.

---

## 🚀 Live Demo & Deployment Target

- **Frontend:** [Vercel](https://vercel.com)
- **Backend:** [Render](https://render.com)
- **Database:** [Supabase PostgreSQL](https://supabase.com)
- **Current Milestone:** **Phase 2 of 7** — Backend Foundation, Real Authentication, PostgreSQL Integration, and Student Profiles.

---

## ✨ Features Implemented in Phase 2

### 1. Real Authentication System (Express + PostgreSQL)
- **Registration (`POST /api/auth/register`):**
  - Schema validation with Zod enforcing minimum lengths and character sets.
  - Email normalization and duplicate detection (409 Conflict).
  - Password hashing via bcrypt with 12 salt rounds.
  - Atomic database transactions creating the user, default profile, and initial statistics.
  - JWT generation set in an `HttpOnly` cookie.
- **Login (`POST /api/auth/login`):**
  - Verification via bcrypt against database hashes.
  - Generic 401 error message for security.
  - Rate limiting to protect against brute force attacks.
- **Session Restoration (`GET /api/auth/me`):**
  - Automatic session hydration on page refresh.
  - Loader state prevents screen flicker.
- **Logout (`POST /api/auth/logout`):**
  - Invalidation of HttpOnly cookie and audit logging.
- **Guest Demo Mode:**
  - Preserved "Explore Demo" option clearly labeled as a guest preview and isolated from production API endpoints.

### 2. PostgreSQL Relational Database Schema (`database/migrations/`)
- `001_users.sql`: User credentials and authentication identity.
- `002_user_profiles.sql`: Student learning goals, preferred programming languages, and bios.
- `003_user_activity.sql`: Audit trails and practice activity stream with compound indexing.
- `004_student_statistics.sql`: Real statistics counters initialized to zero for new accounts.
- `database/migrate.js`: Safe, idempotent migration runner script.

### 3. Connected Student Dashboard (`/dashboard`)
- Real authenticated student display name.
- Real statistics fetched via `GET /api/dashboard/overview` displaying zero metrics for new accounts.
- Activity stream fetched via `GET /api/dashboard/activity` scoped strictly to the authenticated user.
- Loading skeletons, empty states, and error retry handling.

### 4. Student Profile Management (`/profile`)
- `GET /api/users/me` and `PATCH /api/users/me`.
- Update display name, preferred programming language, learning goal, and bio.
- Persistent changes saved in PostgreSQL.

### 5. Application Security & Route Protection
- Protected routes guard private pages (`/dashboard`, `/problems`, `/practice/:id`, `/analytics`, `/profile`) with redirect memory (`state: { from: location }`).
- Helmet headers, CORS credentials support, CSRF mitigation, and centralized error logging.
- Toast notification system for user feedback.
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
