import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { activityRepository } from '../src/repositories/activity.repository.js';
import { statisticsRepository } from '../src/repositories/statistics.repository.js';

describe('CodePulse AI — Backend API Suite (Phase 2)', () => {
  // In-memory test store
  let mockUsers = [];
  let mockProfiles = {};
  let mockStats = {};
  let mockActivities = [];

  beforeEach(() => {
    mockUsers = [];
    mockProfiles = {};
    mockStats = {};
    mockActivities = [];
    vi.restoreAllMocks();

    // Mock userRepository.findByEmail
    vi.spyOn(userRepository, 'findByEmail').mockImplementation(async (email) => {
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      return user || null;
    });

    // Mock userRepository.findById
    vi.spyOn(userRepository, 'findById').mockImplementation(async (id) => {
      const user = mockUsers.find(u => u.id === id);
      if (!user) return null;
      const profile = mockProfiles[id] || {};
      return {
        ...user,
        avatar_url: profile.avatar_url || null,
        preferred_language: profile.preferred_language || 'python',
        learning_goal: profile.learning_goal || '',
        bio: profile.bio || '',
      };
    });

    // Mock userRepository.createWithProfileAndStats
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
        mockProfiles[id] = {
          user_id: id,
          preferred_language: 'python',
          learning_goal: 'Master algorithmic patterns',
          bio: '',
        };
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

    // Mock userRepository.updateProfile
    vi.spyOn(userRepository, 'updateProfile').mockImplementation(
      async (userId, updates) => {
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return null;
        if (updates.fullName) {
          user.full_name = updates.fullName;
        }
        if (!mockProfiles[userId]) mockProfiles[userId] = {};
        if (updates.preferredLanguage !== undefined) mockProfiles[userId].preferred_language = updates.preferredLanguage;
        if (updates.learningGoal !== undefined) mockProfiles[userId].learning_goal = updates.learningGoal;
        if (updates.bio !== undefined) mockProfiles[userId].bio = updates.bio;

        return await userRepository.findById(userId);
      }
    );

    // Mock activityRepository.logActivity
    vi.spyOn(activityRepository, 'logActivity').mockImplementation(
      async (userId, eventType, metadata = {}) => {
        const record = {
          id: mockActivities.length + 1,
          user_id: userId,
          event_type: eventType,
          metadata,
          created_at: new Date().toISOString(),
        };
        mockActivities.push(record);
        return record;
      }
    );

    // Mock activityRepository.getRecentActivityByUser
    vi.spyOn(activityRepository, 'getRecentActivityByUser').mockImplementation(
      async (userId, limit = 10) => {
        return mockActivities
          .filter(a => a.user_id === userId)
          .slice(-limit)
          .reverse();
      }
    );

    // Mock statisticsRepository.getStatsByUserId
    vi.spyOn(statisticsRepository, 'getStatsByUserId').mockImplementation(
      async (userId) => {
        return (
          mockStats[userId] || {
            problemsSolved: 0,
            totalAttempts: 0,
            hintsUsed: 0,
            currentStreak: 0,
            lastPracticeDate: null,
          }
        );
      }
    );
  });

  // 1 & 2. Registration creates a user & passwords are secure
  it('1 & 2. Registration creates a user and stores securely hashed password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'ValidPassword123!',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('jane@example.com');
    expect(res.body.user.fullName).toBe('Jane Doe');
    expect(res.body.user.password_hash).toBeUndefined();

    // Verify cookie was set
    const cookieHeader = res.headers['set-cookie'];
    expect(cookieHeader).toBeDefined();
    expect(cookieHeader[0]).toContain('codepulse_token=');
    expect(cookieHeader[0]).toContain('HttpOnly');

    // Verify password is encrypted in repository
    const stored = mockUsers.find(u => u.email === 'jane@example.com');
    expect(stored).toBeDefined();
    expect(stored.password_hash).not.toBe('ValidPassword123!');
    const isBcryptHash = await bcrypt.compare('ValidPassword123!', stored.password_hash);
    expect(isBcryptHash).toBe(true);
  });

  // 3. Duplicate email is rejected
  it('3. Duplicate email registration is rejected with 409 Conflict', async () => {
    await request(app).post('/api/auth/register').send({
      fullName: 'First Student',
      email: 'dup@example.com',
      password: 'Password123!',
    });

    const res = await request(app).post('/api/auth/register').send({
      fullName: 'Second Student',
      email: 'dup@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('already exists');
  });

  // 4. Invalid registration data is rejected
  it('4. Invalid registration data is rejected with 400 Bad Request', async () => {
    const res = await request(app).post('/api/auth/register').send({
      fullName: 'J', // too short
      email: 'not-an-email',
      password: 'weak', // too short, no numbers
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.details).toBeDefined();
    expect(res.body.details['fullName']).toBeDefined();
    expect(res.body.details['email']).toBeDefined();
    expect(res.body.details['password']).toBeDefined();
  });

  // 5. Valid login succeeds
  it('5. Valid login succeeds and issues an authentication cookie', async () => {
    await request(app).post('/api/auth/register').send({
      fullName: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'SecurePassword1!',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'alex@example.com',
      password: 'SecurePassword1!',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('alex@example.com');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  // 6. Invalid login fails
  it('6. Invalid login fails with generic 401 error', async () => {
    await request(app).post('/api/auth/register').send({
      fullName: 'Alex Rivera',
      email: 'alex2@example.com',
      password: 'SecurePassword1!',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'alex2@example.com',
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Invalid email or password.');
  });

  // 7 & 8. Authenticated /me returns user, unauthenticated returns 401
  it('7 & 8. Authenticated GET /api/auth/me returns user, unauthenticated returns 401', async () => {
    // Unauthenticated
    const unauthRes = await request(app).get('/api/auth/me');
    expect(unauthRes.status).toBe(401);

    // Authenticate
    const regRes = await request(app).post('/api/auth/register').send({
      fullName: 'Sarah Connor',
      email: 'sarah@example.com',
      password: 'Password999!',
    });
    const cookie = regRes.headers['set-cookie'];

    // Authenticated
    const authRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookie);

    expect(authRes.status).toBe(200);
    expect(authRes.body.success).toBe(true);
    expect(authRes.body.user.email).toBe('sarah@example.com');
    expect(authRes.body.user.fullName).toBe('Sarah Connor');
  });

  // 9. Profile updates persist
  it('9. Profile updates persist through PATCH /api/users/me', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      fullName: 'Sam Altman',
      email: 'sam@example.com',
      password: 'Password123!',
    });
    const cookie = reg.headers['set-cookie'];

    const updateRes = await request(app)
      .patch('/api/users/me')
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test')
      .send({
        fullName: 'Samuel H. Altman',
        preferredLanguage: 'python',
        learningGoal: 'Master Graphs and Dynamic Programming',
        bio: 'Building future computing architectures.',
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.data.fullName).toBe('Samuel H. Altman');
    expect(updateRes.body.data.learningGoal).toBe('Master Graphs and Dynamic Programming');
    expect(updateRes.body.data.bio).toBe('Building future computing architectures.');
  });

  // 10. New users receive zero statistics
  it('10. New users receive zero statistics on dashboard overview', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      fullName: 'Newbie Student',
      email: 'newbie@example.com',
      password: 'Password123!',
    });
    const cookie = reg.headers['set-cookie'];

    const dashRes = await request(app)
      .get('/api/dashboard/overview')
      .set('Cookie', cookie);

    expect(dashRes.status).toBe(200);
    expect(dashRes.body.success).toBe(true);
    expect(dashRes.body.data.statistics).toEqual({
      problemsSolved: 0,
      totalAttempts: 0,
      hintsUsed: 0,
      currentStreak: 0,
    });
  });

  // 11. Recent activity is correctly scoped to current user
  it('11. Recent activity is correctly scoped to current user', async () => {
    const regA = await request(app).post('/api/auth/register').send({
      fullName: 'Student A',
      email: 'studentA@example.com',
      password: 'Password123!',
    });
    const cookieA = regA.headers['set-cookie'];

    const regB = await request(app).post('/api/auth/register').send({
      fullName: 'Student B',
      email: 'studentB@example.com',
      password: 'Password123!',
    });
    const cookieB = regB.headers['set-cookie'];

    const actARes = await request(app)
      .get('/api/dashboard/activity')
      .set('Cookie', cookieA);

    expect(actARes.status).toBe(200);
    expect(actARes.body.data.length).toBeGreaterThan(0);
    // Student A's registration event should not belong to Student B
    actARes.body.data.forEach((evt) => {
      if (evt.metadata?.email) {
        expect(evt.metadata.email).toBe('studenta@example.com');
      }
    });
  });

  // 12. Logout clears browser session
  it('12. Logout clears the session cookie', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      fullName: 'Logging Out User',
      email: 'logout@example.com',
      password: 'Password123!',
    });
    const cookie = reg.headers['set-cookie'];

    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookie)
      .set('X-CodePulse-Client', 'test');

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);

    const clearedCookie = logoutRes.headers['set-cookie'];
    expect(clearedCookie[0]).toContain('codepulse_token=;');
  });

  // 13. Dashboard loads after page refresh (session restoration)
  it('13. Dashboard overview loads successfully using existing cookie', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      fullName: 'Persistent Student',
      email: 'persist@example.com',
      password: 'Password123!',
    });
    const cookie = reg.headers['set-cookie'];

    // Simulated browser refresh: new request with cookie
    const refreshRes = await request(app)
      .get('/api/dashboard/overview')
      .set('Cookie', cookie);

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.data.user.fullName).toBe('Persistent Student');
  });

  // 14. Unknown API routes return 404
  it('14. Unknown API routes return 404', async () => {
    const res = await request(app).get('/api/unknown-endpoint-xyz');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  // Bonus: Health check endpoint
  it('Health check endpoint /api/health returns 200 and database status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('codepulse-ai-server');
    expect(res.body.database).toBeDefined();
  });
});
