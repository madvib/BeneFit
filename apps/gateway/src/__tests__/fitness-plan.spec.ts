import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTestApp, createMockUserHub, req, okResult, failResult } from './test-helpers';

describe('Fitness Plan Routes', () => {
  let app: ReturnType<typeof createTestApp>['app'];
  let mockPlanning: Record<string, any>;

  const planFixture = {
    id: crypto.randomUUID(),
    title: '8-Week Strength Program',
    status: 'active',
    goals: { primary: 'strength' },
    weeks: [{ weekNumber: 1, workouts: [] }],
    currentWeek: 1,
    summary: { total: 16, completed: 3 },
  };

  beforeEach(() => {
    mockPlanning = {
      getCurrentPlan: vi.fn().mockResolvedValue(okResult({ plan: planFixture, hasActivePlan: true })),
      generateFromGoals: vi.fn().mockResolvedValue(okResult({
        planId: crypto.randomUUID(), name: 'Custom Plan', durationWeeks: 8, workoutsPerWeek: 4, preview: {},
      })),
      activate: vi.fn().mockResolvedValue(okResult({ planId: planFixture.id, status: 'active' })),
      adjust: vi.fn().mockResolvedValue(okResult({ planId: planFixture.id })),
      pause: vi.fn().mockResolvedValue(okResult({ planId: planFixture.id, status: 'paused' })),
    };

    const mockUserHub = createMockUserHub({ planning: mockPlanning });
    const created = createTestApp({ USER_HUB: mockUserHub as any });
    app = created.app;
  });

  describe('GET /api/fitness-plan/active', () => {
    it('should return active plan', async () => {
      const res = await req(app).get('/api/fitness-plan/active');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.hasActivePlan).toBe(true);
      expect(body.plan.title).toBe('8-Week Strength Program');
    });

    it('should return null plan when none active', async () => {
      mockPlanning.getCurrentPlan.mockResolvedValue(okResult({ plan: null, hasActivePlan: false }));

      const res = await req(app).get('/api/fitness-plan/active');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.hasActivePlan).toBe(false);
    });

    it('should return 404 with NO_ACTIVE_PLAN code', async () => {
      mockPlanning.getCurrentPlan.mockResolvedValue(failResult('No active plan', 'NO_ACTIVE_PLAN'));

      const res = await req(app).get('/api/fitness-plan/active');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/fitness-plan/activate', () => {
    it('should activate a plan', async () => {
      const res = await req(app).post('/api/fitness-plan/activate', { planId: planFixture.id });
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/fitness-plan/pause', () => {
    it('should pause a plan', async () => {
      const res = await req(app).post('/api/fitness-plan/pause', { planId: planFixture.id });
      expect(res.status).toBe(200);
    });
  });
});
