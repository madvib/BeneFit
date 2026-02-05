import { describe, it, expect } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';

describe('Basic DO Test', () => {
  it('should access DO storage without migrations', async () => {
    const id = env.WORKOUT_SESSION.idFromName('basic-test');
    const stub = env.WORKOUT_SESSION.get(id);

    await runInDurableObject(stub, async (instance: any, state: any) => {
      // Just try to access storage directly
      const sql = state.storage.sql;
      expect(sql).toBeDefined();
    });
  });
});
