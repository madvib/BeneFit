import { describe, it, expect } from 'vitest';
import { UserStatsSchema, toUserStatsSchema } from '../user-stats.presentation.js';
import { createUserStats } from '../user-stats.factory.js';

describe('UserStats Presentation', () => {
  it('should map valid stats to presentation DTO', () => {
    const stats = createUserStats(new Date());

    const presentation = toUserStatsSchema(stats);
    const result = UserStatsSchema.safeParse(presentation);

    expect(result.success).toBe(true);
    expect(presentation.totalWorkouts).toBe(0);
    expect(presentation.achievements).toHaveLength(0);
  });
});
