import { describe, it, expect, vi } from 'vitest';

// Mock Cloudflare Workers env
vi.mock('cloudflare:workers', () => ({
  env: {},
}));

import app from '../src/index';

describe('Gateway Integration Tests', () => {
  describe('Health Check', () => {
    it('GET /health should return 200 OK', async () => {
      const res = await app.request('/health');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('status', 'ok');
      expect(data).toHaveProperty('timestamp');
    });
  });

  // Note: Authenticated routes require mocking middleware or specific environment setup
  // which is beyond the scope of this initial integration suite.
});
