import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTestApp, createMockUserHub, req, okResult, failResult, TEST_USER } from './test-helpers';

describe('Profile Routes', () => {
  let app: ReturnType<typeof createTestApp>['app'];
  let mockProfile: Record<string, any>;

  const profileFixture = {
    userId: TEST_USER.id,
    displayName: 'Test User',
    bio: 'Test bio',
    experienceProfile: { level: 'intermediate' },
    fitnessGoals: { primary: 'strength' },
    stats: { totalWorkouts: 10, currentStreak: 3 },
  };

  const statsFixture = {
    totalWorkouts: 42,
    totalMinutes: 1260,
    totalVolume: 50000,
    currentStreak: 7,
    longestStreak: 14,
    achievements: [],
  };

  beforeEach(() => {
    mockProfile = {
      get: vi.fn().mockResolvedValue(okResult(profileFixture)),
      create: vi.fn().mockResolvedValue(okResult(profileFixture)),
      updateGoals: vi.fn().mockResolvedValue(okResult({ userId: profileFixture.userId, goals: { primary: 'endurance' }, suggestNewPlan: true })),
      updatePreferences: vi.fn().mockResolvedValue(okResult({ userId: profileFixture.userId })),
      getStats: vi.fn().mockResolvedValue(okResult(statsFixture)),
      updateConstraints: vi.fn().mockResolvedValue(okResult({ userId: profileFixture.userId })),
    };

    const mockUserHub = createMockUserHub({ profile: mockProfile });
    const created = createTestApp({ USER_HUB: mockUserHub as any });
    app = created.app;
  });

  describe('GET /api/profile', () => {
    it('should return user profile', async () => {
      const res = await req(app).get('/api/profile');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.userId).toBe(TEST_USER.id);
      expect(body.displayName).toBe('Test User');
    });

    it('should return 404 when profile not found', async () => {
      mockProfile.get.mockResolvedValue(failResult('UserProfile not found', 'ENTITY_NOT_FOUND'));

      const res = await req(app).get('/api/profile');

      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.error).toContain('not found');
    });
  });

  describe('GET /api/profile/stats', () => {
    it('should return user statistics', async () => {
      const res = await req(app).get('/api/profile/stats');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.totalWorkouts).toBe(42);
      expect(body.currentStreak).toBe(7);
    });

    it('should return 500 on repository error', async () => {
      mockProfile.getStats.mockResolvedValue(failResult('Database error', 'REPOSITORY_ERROR'));

      const res = await req(app).get('/api/profile/stats');

      expect(res.status).toBe(500);
    });
  });
});
