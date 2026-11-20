import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { problemRepository } from '../src/repositories/problem.repository.js';
import { sessionRepository } from '../src/repositories/session.repository.js';
import { activityRepository } from '../src/repositories/activity.repository.js';
import { statisticsRepository } from '../src/repositories/statistics.repository.js';

describe('CodePulse AI — Problem Catalog & Workspace Suite (Phase 3)', () => {
  // In-memory data store for tests
  let mockUsers = [];
  let mockProblems = [];
  let mockSessions = [];
  let mockDrafts = {};
  let mockAttempts = [];
  let mockStats = {};
  let mockActivities = [];

  const SEED_PROBLEMS = [
    {
      id: 'p-1',
      slug: 'two-sum',
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices...',
      difficulty: 'easy',
      topics: ['Arrays', 'Hashing'],
      constraints: ['2 <= nums.length <= 10^4'],
      examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
      starter_code: 'class Solution:\n    def twoSum(self, nums, target):\n        pass\n',
      function_name: 'twoSum',
      is_published: true,
      created_at: new Date('2026-01-01').toISOString(),
    },
    {
      id: 'p-2',
      slug: 'longest-substring-without-repeating',
      title: 'Longest Substring Without Repeating Characters',
      description: 'Given a string s, find the length of the longest substring...',
      difficulty: 'medium',
      topics: ['Strings', 'Sliding Window', 'Hashing'],
      constraints: ['0 <= s.length <= 5 * 10^4'],
      examples: [{ input: 's = "abcabcbb"', output: '3' }],
      starter_code: 'class Solution:\n    def lengthOfLongestSubstring(self, s):\n        pass\n',
      function_name: 'lengthOfLongestSubstring',
      is_published: true,
      created_at: new Date('2026-01-02').toISOString(),
    },
    {
      id: 'p-3',
      slug: 'hard-problem',
      title: 'Trapping Rain Water',
      description: 'Given n non-negative integers...',
      difficulty: 'hard',
      topics: ['Two Pointers', 'Stack'],
      constraints: ['n == height.length'],
      examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }],
      starter_code: 'class Solution:\n    def trap(self, height):\n        pass\n',
      function_name: 'trap',
      is_published: true,
      created_at: new Date('2026-01-03').toISOString(),
    },
  ];

  beforeEach(() => {
    mockUsers = [];
    mockProblems = [...SEED_PROBLEMS];
    mockSessions = [];
    mockDrafts = {};
    mockAttempts = [];
    mockStats = {};
    mockActivities = [];
    vi.restoreAllMocks();

    // ─── User Repo Mocks ──────────────────────────────────────────────────
    vi.spyOn(userRepository, 'findByEmail').mockImplementation(async (email) => {
      return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    });

    vi.spyOn(userRepository, 'findById').mockImplementation(async (id) => {
      const user = mockUsers.find(u => u.id === id);
      if (!user) return null;
      return {
        ...user,
        avatar_url: null,
        preferred_language: 'python',
        learning_goal: '',
        bio: '',
      };
    });

    vi.spyOn(userRepository, 'createWithProfileAndStats').mockImplementation(
      async ({ fullName, email, passwordHash }) => {
        const id = 'usr_' + Math.random().toString(36).substring(2, 9);
        const newUser = {
          id,
          full_name: fullName,
          email: email.toLowerCase(),
          password_hash: passwordHash,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        mockStats[id] = {
          user_id: id,
          problemsSolved: 0,
          totalAttempts: 0,
          hintsUsed: 0,
          currentStreak: 0,
          lastPracticeDate: null,
        };
        return newUser;
      }
    );

    // ─── Problem Repo Mocks ───────────────────────────────────────────────
    vi.spyOn(problemRepository, 'findAll').mockImplementation(async (filters = {}, pagination = { page: 1, limit: 20 }) => {
      let filtered = mockProblems.filter(p => p.is_published);
      if (filters.search) {
        const s = filters.search.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
      }
      if (filters.difficulty) {
        filtered = filtered.filter(p => p.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
      }
      if (filters.topic) {
        filtered = filtered.filter(p => p.topics.includes(filters.topic));
      }
      const total = filtered.length;
      const start = (pagination.page - 1) * pagination.limit;
      const paginated = filtered.slice(start, start + pagination.limit);
      return {
        problems: paginated,
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      };
    });

    vi.spyOn(problemRepository, 'findBySlug').mockImplementation(async (slug) => {
      return mockProblems.find(p => p.slug === slug && p.is_published) || null;
    });

    vi.spyOn(problemRepository, 'findById').mockImplementation(async (id) => {
      return mockProblems.find(p => p.id === id && p.is_published) || null;
    });

    // ─── Session Repo Mocks ───────────────────────────────────────────────
    vi.spyOn(sessionRepository, 'findActiveSession').mockImplementation(async (userId, problemId) => {
      const session = mockSessions.find(
        s => s.user_id === userId && s.problem_id === problemId && ['active', 'paused'].includes(s.status)
      );
      if (!session) return null;
      const draft = mockDrafts[session.id] || {};
      return {
        ...session,
        code: draft.code,
        version: draft.version,
        language: draft.language || 'python',
        draft_updated_at: draft.updated_at,
      };
    });

    vi.spyOn(sessionRepository, 'create').mockImplementation(async (userId, problemId) => {
      const session = {
        id: 'sess_' + Math.random().toString(36).substring(2, 9),
        user_id: userId,
        problem_id: problemId,
        status: 'active',
        started_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
        completed_at: null,
      };
      mockSessions.push(session);
      return session;
    });

    vi.spyOn(sessionRepository, 'findById').mockImplementation(async (sessionId) => {
      const session = mockSessions.find(s => s.id === sessionId);
      if (!session) return null;
      const draft = mockDrafts[session.id] || {};
      return {
        ...session,
        code: draft.code,
        version: draft.version,
        language: draft.language || 'python',
        draft_updated_at: draft.updated_at,
      };
    });

    vi.spyOn(sessionRepository, 'findByUserId').mockImplementation(async (userId) => {
      return mockSessions.filter(s => s.user_id === userId);
    });

    vi.spyOn(sessionRepository, 'updateLastActive').mockImplementation(async (sessionId) => {
      const session = mockSessions.find(s => s.id === sessionId);
      if (session) session.last_active_at = new Date().toISOString();
    });

    vi.spyOn(sessionRepository, 'upsertDraft').mockImplementation(async (sessionId, code, incomingVersion, language = 'python') => {
      const existing = mockDrafts[sessionId];
      if (existing) {
        if (incomingVersion < existing.version) {
          return { conflict: true, storedVersion: existing.version };
        }
        const updated = {
          session_id: sessionId,
          code,
          version: existing.version + 1,
          language,
          updated_at: new Date().toISOString(),
        };
        mockDrafts[sessionId] = updated;
        return { conflict: false, draft: updated };
      } else {
        const created = {
          session_id: sessionId,
          code,
          version: 1,
          language,
          updated_at: new Date().toISOString(),
        };
        mockDrafts[sessionId] = created;
        return { conflict: false, draft: created };
      }
    });

    vi.spyOn(sessionRepository, 'getDraft').mockImplementation(async (sessionId) => {
      return mockDrafts[sessionId] || null;
    });

    vi.spyOn(sessionRepository, 'createAttempt').mockImplementation(async (sessionId, codeSnapshot, language, attemptType) => {
      const attempt = {
        id: 'att_' + Math.random().toString(36).substring(2, 9),
        session_id: sessionId,
        code_snapshot: codeSnapshot,
        language,
        attempt_type: attemptType,
        evaluation_status: 'not_evaluated',
        created_at: new Date().toISOString(),
      };
      mockAttempts.push(attempt);
      return attempt;
    });

    vi.spyOn(sessionRepository, 'getAttempts').mockImplementation(async (sessionId) => {
      return mockAttempts.filter(a => a.session_id === sessionId);
    });

    // ─── Activity & Stats Mocks ───────────────────────────────────────────
    vi.spyOn(activityRepository, 'logActivity').mockImplementation(async (userId, eventType, metadata = {}) => {
      const record = {
        id: mockActivities.length + 1,
        user_id: userId,
        event_type: eventType,
        metadata,
        created_at: new Date().toISOString(),
      };
      mockActivities.push(record);
      return record;
    });

    vi.spyOn(statisticsRepository, 'getStatsByUserId').mockImplementation(async (userId) => {
      return (
        mockStats[userId] || {
          problemsSolved: 0,
          totalAttempts: 0,
          hintsUsed: 0,
          currentStreak: 0,
          lastPracticeDate: null,
        }
      );
    });

    vi.spyOn(statisticsRepository, 'incrementTotalAttempts').mockImplementation(async (userId) => {
      if (!mockStats[userId]) {
        mockStats[userId] = {
          problemsSolved: 0,
          totalAttempts: 0,
          hintsUsed: 0,
          currentStreak: 0,
          lastPracticeDate: null,
        };
      }
      mockStats[userId].totalAttempts += 1;
      return mockStats[userId];
    });
  });

  // Helper to register and return cookie
  async function createAuthenticatedUser(name = 'Test Student', email = 'test@example.com') {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: name,
        email,
        password: 'Password123!',
      });
    return {
      user: res.body.user,
      cookie: res.headers['set-cookie'],
    };
  }

  // 1. Authenticated users can list published problems
  it('1. Authenticated users can list published problems', async () => {
    const { cookie } = await createAuthenticatedUser();

    const res = await request(app)
      .get('/api/problems')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.problems.length).toBe(3);
    expect(res.body.data.total).toBe(3);
  });

  // 2. Search filter returns correct results
  it('2. Search filter returns correct matching problems', async () => {
    const { cookie } = await createAuthenticatedUser();

    const res = await request(app)
      .get('/api/problems?search=Two+Sum')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.problems.length).toBe(1);
    expect(res.body.data.problems[0].title).toBe('Two Sum');
  });

  // 3. Difficulty filter works
  it('3. Difficulty filter works correctly', async () => {
    const { cookie } = await createAuthenticatedUser();

    const res = await request(app)
      .get('/api/problems?difficulty=medium')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.problems.length).toBe(1);
    expect(res.body.data.problems[0].difficulty).toBe('medium');
  });

  // 4. Unknown slug returns 404
  it('4. Unknown problem slug returns 404 Not Found', async () => {
    const { cookie } = await createAuthenticatedUser();

    const res = await request(app)
      .get('/api/problems/non-existent-problem-slug')
      .set('Cookie', cookie);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('not found');
  });

  // 5. Starting a session creates a draft with starter code
  it('5. Starting a session initializes a draft with problem starter code', async () => {
    const { cookie } = await createAuthenticatedUser();

    const res = await request(app)
      .post('/api/sessions')
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ problemId: 'p-1' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.session).toBeDefined();
    expect(res.body.data.draft.code).toContain('class Solution');
    expect(res.body.data.isNew).toBe(true);
  });

  // 6. Reopening same problem resumes correct session
  it('6. Reopening the same problem resumes the existing active session', async () => {
    const { cookie } = await createAuthenticatedUser();

    // Start session 1
    const firstRes = await request(app)
      .post('/api/sessions')
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ problemId: 'p-1' });

    const sessionId = firstRes.body.data.session.id;

    // Save customized code
    await request(app)
      .put(`/api/sessions/${sessionId}/draft`)
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ code: '# My updated solution code\n', version: 1 });

    // Reopen problem
    const secondRes = await request(app)
      .post('/api/sessions')
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ problemId: 'p-1' });

    expect(secondRes.status).toBe(200);
    expect(secondRes.body.data.isNew).toBe(false);
    expect(secondRes.body.data.session.id).toBe(sessionId);
    expect(secondRes.body.data.draft.code).toBe('# My updated solution code\n');
  });

  // 7. Draft update increments version
  it('7. Updating code draft increments version', async () => {
    const { cookie } = await createAuthenticatedUser();

    const sessRes = await request(app)
      .post('/api/sessions')
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ problemId: 'p-1' });

    const sessionId = sessRes.body.data.session.id;

    const draftRes = await request(app)
      .put(`/api/sessions/${sessionId}/draft`)
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ code: '# draft v2', version: 1 });

    expect(draftRes.status).toBe(200);
    expect(draftRes.body.success).toBe(true);
    expect(draftRes.body.data.version).toBe(2);
  });

  // 8. Version conflict (stale version) returns 409
  it('8. Saving draft with stale version returns 409 Conflict', async () => {
    const { cookie } = await createAuthenticatedUser();

    const sessRes = await request(app)
      .post('/api/sessions')
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ problemId: 'p-1' });

    const sessionId = sessRes.body.data.session.id;

    // Advance draft to version 2
    await request(app)
      .put(`/api/sessions/${sessionId}/draft`)
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ code: '# version 2', version: 1 });

    // Stale write sending version 0 against stored version 2
    const conflictRes = await request(app)
      .put(`/api/sessions/${sessionId}/draft`)
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ code: '# conflict write', version: 0 });

    expect(conflictRes.status).toBe(409);
    expect(conflictRes.body.success).toBe(false);
    expect(conflictRes.body.error).toContain('conflict');
  });

  // 9. User A cannot access User B's session (403)
  it('9. User A cannot access User B\'s practice session (403 Forbidden)', async () => {
    const userA = await createAuthenticatedUser('User A', 'usera@example.com');
    const userB = await createAuthenticatedUser('User B', 'userb@example.com');

    // User A creates a session
    const sessA = await request(app)
      .post('/api/sessions')
      .set('Cookie', userA.cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ problemId: 'p-1' });

    const sessionAId = sessA.body.data.session.id;

    // User B tries to view User A's session
    const forbiddenGet = await request(app)
      .get(`/api/sessions/${sessionAId}`)
      .set('Cookie', userB.cookie);

    expect(forbiddenGet.status).toBe(403);
    expect(forbiddenGet.body.success).toBe(false);

    // User B tries to save draft to User A's session
    const forbiddenPut = await request(app)
      .put(`/api/sessions/${sessionAId}/draft`)
      .set('Cookie', userB.cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ code: '# hacked code', version: 1 });

    expect(forbiddenPut.status).toBe(403);
    expect(forbiddenPut.body.success).toBe(false);
  });

  // 10. Manual attempt stored as not_evaluated
  it('10. Manual attempt is stored with evaluation_status: not_evaluated', async () => {
    const { cookie } = await createAuthenticatedUser();

    const sessRes = await request(app)
      .post('/api/sessions')
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ problemId: 'p-1' });

    const sessionId = sessRes.body.data.session.id;

    const attemptRes = await request(app)
      .post(`/api/sessions/${sessionId}/attempts`)
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ code: 'def twoSum(): pass', attemptType: 'manual_snapshot' });

    expect(attemptRes.status).toBe(201);
    expect(attemptRes.body.success).toBe(true);
    expect(attemptRes.body.data.evaluation_status).toBe('not_evaluated');
    expect(attemptRes.body.data.attempt_type).toBe('manual_snapshot');
  });

  // 11. No manual attempt increments problems_solved
  it('11. Manual attempt increments total_attempts but leaves problems_solved at 0', async () => {
    const { user, cookie } = await createAuthenticatedUser();

    const sessRes = await request(app)
      .post('/api/sessions')
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ problemId: 'p-1' });

    const sessionId = sessRes.body.data.session.id;

    // Take two snapshots
    await request(app)
      .post(`/api/sessions/${sessionId}/attempts`)
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ code: '# snap 1', attemptType: 'manual_snapshot' });

    await request(app)
      .post(`/api/sessions/${sessionId}/attempts`)
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({ code: '# snap 2', attemptType: 'manual_snapshot' });

    const stats = await statisticsRepository.getStatsByUserId(user.id);
    expect(stats.totalAttempts).toBe(2);
    expect(stats.problemsSolved).toBe(0); // MUST NEVER be incremented without execution
  });

  // 12. Unauthenticated access to problem routes is rejected
  it('12. Unauthenticated access to problems or sessions returns 401', async () => {
    const unauthProb = await request(app).get('/api/problems');
    expect(unauthProb.status).toBe(401);

    const unauthSess = await request(app).get('/api/sessions');
    expect(unauthSess.status).toBe(401);
  });
});
