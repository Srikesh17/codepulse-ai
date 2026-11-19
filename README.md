# CodePulse AI — Socratic Coding & Retention Coach

> **"Stop Copying Solutions. Start Thinking Like an Engineer."**

CodePulse AI is a modern web platform designed to eliminate passive pattern memorization during technical interview preparation. Instead of dumping direct code solutions, CodePulse AI employs a structured Socratic methodology: asking diagnostic questions, probing algorithmic invariants, and guiding candidates to discover optimal solutions on their own for deep, durable recall.

---

## 🚀 Live Demo & Deployment

- **Preview Deployment:** Ready for instant deployment on [Vercel](https://vercel.com).
- **Current Phase:** **Phase 1 of 7** — Production-quality, responsive frontend with Monaco IDE, demo authentication, problem catalog, and retention analytics.

---

## ✨ Features Implemented in Phase 1

### 1. Complete Authentication UI (Demo-Ready)
- **Landing Page (`/`):** High-converting SaaS hero section, value proposition, "Why Traditional Copying Fails" comparison matrix, interactive workspace preview, 3-step workflow, and responsive public navigation.
- **Signup Page (`/signup`):** Full name, email, password strength checking, confirm password with show/hide toggle, client-side input validation, and clear demo notice.
- **Login Page (`/login`):** Email and password authentication with validation, autofill demo credentials button, session persistence toggle, and link to password reset guidance.
- **Instant Demo Access:** "Explore Demo" button on all entry points for one-click reviewer access to the student workspace without manual credential input.

### 2. Student Dashboard & Problem Catalog
- **Dashboard (`/dashboard`):** Real-time statistics cards (Problems Solved, Total Attempts, Hints Used, Current Streak), recent Socratic insights, and recommended problem quick-launch.
- **Problem Catalog (`/problems`):** 10 curated algorithmic problems seeded across Arrays, Strings, Hashing, Two Pointers, and Dynamic Programming with difficulty badges and real-time search/filtering.

### 3. Monaco Coding Workspace & Socratic Tutor
- **3-Panel IDE Layout (`/practice/:problemId`):**
  1. **Left:** Problem specification, constraints, formatted input/output examples, and interactive test case previews.
  2. **Center:** Full Monaco Code Editor (VS Code core) configured for Python 3 with local draft persistence.
  3. **Right:** Socratic AI Tutor panel featuring mode selector (Socratic Guided vs Direct Concept), 3-tier progressive hint disclosure, and conversation history.
- **Transparent Execution Feedback:** Clear indicators that backend code execution will arrive in Phase 4, avoiding misleading mock executions.

### 4. Retention & Habit Analytics
- **Analytics View (`/analytics`):** Interactive Recharts visualizations including weekly activity volume, problem completion breakdown by difficulty, and hint dependency trajectory curves.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React.js 18 (Vite) |
| **Styling & Design System** | Tailwind CSS (Custom Charcoal/Navy Dark Palette + Emerald Accents) |
| **Routing** | React Router DOM v6 (SPA rewrites for Vercel) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Data Visualization** | Recharts |
| **Icons** | Lucide React |
| **State Management** | React Context API (`AuthContext`) |

---

## 📂 Project Structure

```text
codepulse-ai/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── PublicNavbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Badge.jsx
│   │   │       ├── Card.jsx
│   │   │       └── DemoNoticeBanner.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── data/
│   │   │   └── problems.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProblemsPage.jsx
│   │   │   ├── PracticePage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── vercel.json
├── server/
│   └── README.md
├── database/
│   └── README.md
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   └── ROADMAP.md
├── vercel.json
└── README.md
```

---

## ⚡ Local Setup Instructions

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Step-by-Step Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/codepulse-ai.git
   cd codepulse-ai
   ```

2. Navigate to the client directory and install dependencies:
   ```bash
   cd client
   npm install
   ```

3. Launch the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. Build for production preview:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🌐 Vercel Deployment Instructions

### Method 1: Deploy via Vercel Dashboard (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `codepulse-ai` repository.
4. In the Project Configuration:
   - **Framework Preset:** Vite
   - **Root Directory:** `client` (Click "Edit" and select `client`)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**. Vercel will automatically build the client and apply the SPA rewrites defined in `vercel.json`.

### Method 2: Deploy via Vercel CLI
```bash
cd client
npm install -g vercel
vercel
```

---

## 🗺️ Seven-Phase Roadmap

- [x] **Phase 1: Deployable Frontend & Monaco Workspace** (Current)
- [ ] **Phase 2: Express Backend & PostgreSQL Authentication**
- [ ] **Phase 3: Socratic Gemini AI Integration**
- [ ] **Phase 4: Sandboxed Code Execution Engine**
- [ ] **Phase 5: Spaced-Repetition Retention Tracking**
- [ ] **Phase 6: End-to-End Testing & Hardening**
- [ ] **Phase 7: Production Release & CI/CD**

---

## 📄 License
This project is licensed under the MIT License.
