import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTestApp, createMockUserHub, req, okResult, failResult } from './test-helpers';

describe('Coach Routes', () => {
  let app: ReturnType<typeof createTestApp>['app'];
  let mockCoach: Record<string, any>;

  const historyFixture = {
    messages: [
      { id: 'msg-1', role: 'user', content: 'How should I train today?', timestamp: new Date().toISOString() },
      { id: 'msg-2', role: 'coach', content: 'Based on your plan...', timestamp: new Date().toISOString(), actions: [] },
    ],
    pendingCheckIns: [],
    stats: { totalMessages: 2, totalCheckIns: 0, actionsApplied: 0 },
  };

  beforeEach(() => {
    mockCoach = {
      getHistory: vi.fn().mockResolvedValue(okResult(historyFixture)),
      sendMessage: vi.fn().mockResolvedValue(okResult({
        conversationId: 'conv-1',
        coachResponse: 'Here is my recommendation...',
        actions: [],
        suggestedFollowUps: ['How about a rest day?'],
      })),
      generateWeeklySummary: vi.fn().mockResolvedValue(okResult({
        summary: 'Good week.', highlights: ['4/5 workouts'], suggestions: ['More mobility'],
      })),
      dismissCheckIn: vi.fn().mockResolvedValue(okResult({ conversationId: 'conv-1', dismissed: true })),
      respondToCheckIn: vi.fn().mockResolvedValue(okResult({ conversationId: 'conv-1', coachAnalysis: 'Good feedback', actions: [] })),
      triggerProactiveCheckIn: vi.fn().mockResolvedValue(okResult({ checkInId: 'ci-1', question: 'How are you feeling?', triggeredBy: 'low_adherence' })),
    };

    const mockUserHub = createMockUserHub({ coach: mockCoach });
    const created = createTestApp({ USER_HUB: mockUserHub as any });
    app = created.app;
  });

  describe('GET /api/coach/history', () => {
    it('should return conversation history with stats', async () => {
      const res = await req(app).get('/api/coach/history');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.messages).toHaveLength(2);
      expect(body.stats.totalMessages).toBe(2);
    });
  });

  describe('POST /api/coach/message', () => {
    it('should send message and return coach response', async () => {
      const res = await req(app).post('/api/coach/message', { message: 'What should I focus on?' });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.coachResponse).toBeDefined();
      expect(body.conversationId).toBe('conv-1');
    });

    it('should reject empty message body', async () => {
      const res = await req(app).post('/api/coach/message', {});
      expect(res.status).toBe(400);
    });

    it('should return 502 on AI error', async () => {
      mockCoach.sendMessage.mockResolvedValue(failResult('AI service unavailable', 'AI_ERROR'));

      const res = await req(app).post('/api/coach/message', { message: 'Hello' });
      expect(res.status).toBe(502);
    });
  });

  describe('POST /api/coach/summary', () => {
    it('should generate weekly summary', async () => {
      const res = await req(app).post('/api/coach/summary');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.highlights).toBeInstanceOf(Array);
      expect(body.suggestions).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/coach/check-in/dismiss', () => {
    it('should dismiss a check-in', async () => {
      const res = await req(app).post('/api/coach/check-in/dismiss', { checkInId: crypto.randomUUID() });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.dismissed).toBe(true);
    });

    it('should reject missing checkInId', async () => {
      const res = await req(app).post('/api/coach/check-in/dismiss', {});
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/coach/check-in/respond', () => {
    it('should respond to check-in and get analysis', async () => {
      const res = await req(app).post('/api/coach/check-in/respond', {
        checkInId: crypto.randomUUID(),
        response: 'Feeling great!',
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.coachAnalysis).toBeDefined();
    });
  });

  describe('POST /api/coach/check-in/trigger', () => {
    it('should trigger proactive check-in', async () => {
      const res = await req(app).post('/api/coach/check-in/trigger');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.checkInId).toBeDefined();
      expect(body.triggeredBy).toBe('low_adherence');
    });
  });
});
