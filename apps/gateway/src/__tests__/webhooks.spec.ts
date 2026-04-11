import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { webhookRoutes } from '../routes/webhooks.js';
import { createMockEnv } from './test-helpers';

describe('Strava Webhook Routes', () => {
  let app: Hono;

  beforeEach(() => {
    const mockEnv = createMockEnv({ STRAVA_VERIFY_TOKEN: 'STRAVA' });

    app = new Hono<{ Bindings: Env }>()
      .use('*', async (c, next) => {
        (c as any).env = { ...c.env, ...mockEnv };
        await next();
      })
      .route('/webhooks', webhookRoutes);
  });

  describe('GET /webhooks/strava (subscription validation)', () => {
    it('should echo challenge on valid subscription request', async () => {
      const res = await app.request(
        '/webhooks/strava?hub.mode=subscribe&hub.challenge=test-challenge-123&hub.verify_token=STRAVA',
      );

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body['hub.challenge']).toBe('test-challenge-123');
    });

    it('should reject invalid verify token', async () => {
      const res = await app.request(
        '/webhooks/strava?hub.mode=subscribe&hub.challenge=test&hub.verify_token=WRONG',
      );
      expect(res.status).toBe(403);
    });

    it('should reject invalid mode', async () => {
      const res = await app.request(
        '/webhooks/strava?hub.mode=invalid&hub.challenge=test&hub.verify_token=STRAVA',
      );
      expect(res.status).toBe(400);
    });

    it('should reject missing challenge', async () => {
      const res = await app.request(
        '/webhooks/strava?hub.mode=subscribe&hub.verify_token=STRAVA',
      );
      expect(res.status).toBe(400);
    });
  });

  describe('POST /webhooks/strava (event processing)', () => {
    it('should ignore non-activity events', async () => {
      const res = await app.request('/webhooks/strava', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object_type: 'athlete',
          object_id: 123,
          aspect_type: 'update',
          owner_id: 456,
          subscription_id: 789,
          event_time: Date.now() / 1000,
        }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('ignored');
    });

    it('should reject events with wrong subscription_id', async () => {
      const envWithSubId = createMockEnv({
        STRAVA_VERIFY_TOKEN: 'STRAVA',
        STRAVA_SUBSCRIPTION_ID: '999',
      });

      const appWithSub = new Hono<{ Bindings: Env }>()
        .use('*', async (c, next) => {
          (c as any).env = envWithSubId;
          await next();
        })
        .route('/webhooks', webhookRoutes);

      const res = await appWithSub.request('/webhooks/strava', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object_type: 'activity',
          object_id: 123,
          aspect_type: 'create',
          owner_id: 456,
          subscription_id: 111,
          event_time: Date.now() / 1000,
        }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('rejected');
    });
  });
});
