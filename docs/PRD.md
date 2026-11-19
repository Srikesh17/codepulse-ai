# Product Requirements Document (PRD)
## CodePulse AI — Socratic Coding & Retention Coach

### 1. Vision & Problem Statement
Engineers and students preparing for technical interviews frequently resort to passive pattern copying: memorizing LeetCode solutions or relying on AI chat completions that dump full solutions. Consequently, when faced with unseen problems or live interviewers asking "Why did you choose this data structure?", candidates freeze due to superficial retention and lack of genuine mental models.

**CodePulse AI** reverses this failure loop. Powered by Socratic pedagogy and progressive algorithmic inquiry, CodePulse acts as an expert mentor that asks targeted questions, probes invariant assumptions, and guides the student to derive the solution themselves.

### 2. Target Audience
- Software engineering students and coding bootcamp graduates.
- Working software engineers preparing for technical interviews.
- Self-taught developers seeking structured mastery of data structures & algorithms (DSA).

### 3. Core Value Propositions
1. **Zero-Spoiler Socratic Coaching:** Tiered progressive hints (Nudge -> Conceptual Strategy -> Invariant Logic) that safeguard the "Aha!" learning moment.
2. **Integrated Monaco IDE:** Full-featured Python 3 coding sandbox directly in the browser.
3. **Retention & Dependency Tracking:** Quantitative analytics tracking how hint reliance decreases over consecutive sessions.
4. **Curated Problem Taxonomy:** Targeted sets in Arrays, Two Pointers, Hashing, Dynamic Programming, and Graph algorithms.

### 4. Phased Execution Plan
- **Phase 1 (Current):** High-fidelity deployable frontend with complete authentication UI (demo mode), student dashboard, problem catalog, Monaco workspace, Socratic hint panel, and retention analytics.
- **Phase 2:** Node.js/Express REST backend, PostgreSQL relational database, bcrypt authentication, and JWT sessions.
- **Phase 3:** Google Gemini API Socratic coaching service with system prompts engineered against solution leakage.
- **Phase 4:** Sandboxed code execution engine with automated test runner.
- **Phase 5:** Comprehensive retention analytics & spaced-repetition scheduler.
- **Phase 6:** Full end-to-end integration and load testing.
- **Phase 7:** Production deployment, custom domain, CI/CD pipelines, and public release.
