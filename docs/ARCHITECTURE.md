# System Architecture
## CodePulse AI — Socratic Coding & Retention Coach

### 1. High-Level Architecture

```
[ Client: React + Vite + Tailwind CSS ]
         │
         ├─── Monaco Code Editor (Browser IDE)
         ├─── Recharts Analytics Dashboard
         └─── Socratic Guidance Interface
         │
         ▼  (HTTPS / REST)
[ Backend Gateway: Node.js + Express (Phase 2) ]
         │
         ├─── Auth Service (JWT + Bcrypt)
         ├─── Problem Service (Catalog & Test Specs)
         ├─── Socratic Tutor Agent (Gemini API SDK - Phase 3)
         └─── Code Runner Worker (Docker / Sandboxed Runner - Phase 4)
         │
         ▼
[ Persistence Layer: PostgreSQL Database (Phase 2) ]
         ├── Users & Credentials
         ├── Problem Definitions
         ├── Code Submissions & Drafts
         └── Socratic Dialogue Logs & Retention Metrics
```

### 2. Frontend Layer (Phase 1)
- **Framework:** React 18 + Vite SPA
- **Styling:** Tailwind CSS with custom dark navy palette (`#070b14`, `#0b1120`, `#111827`, `#1e293b`) and emerald accents (`#10b981`).
- **Editor:** `@monaco-editor/react` configured for Python with live client-side draft preservation in `localStorage`.
- **Navigation:** `react-router-dom` v6 with SPA rewrites configured for Vercel deployment.
- **State Management:** React Context API (`AuthContext`) managing user session, simulated demo credentials, and guest exploration mode.

### 3. Security & Data Integrity Principles
- Clear demarcation between frontend demo states and production persistence.
- Phase 1 strictly informs users that credentials are simulated locally and no secrets or database connections are exposed.
- Modular service interfaces designed for seamless backend binding in Phase 2.
