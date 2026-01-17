import { describe, it, expect } from 'vitest';
import { createTemplateStructure } from '../template-structure.factory.js';

describe('TemplateStructure', () => {
  const validWeek = {
    weekNumber: 1,
    workouts: [
      {
        dayOfWeek: 1,
        type: 'cardio' as const,
        durationMinutes: 30,
        activities: [
          {
            activityType: 'main' as const,
            template: 'Run',
            variables: {}
          }
        ]
      }
    ]
  };

  const validProps = {
    duration: { type: 'fixed', weeks: 4 },
    frequency: { type: 'fixed', workoutsPerWeek: 3 },
    weeks: [validWeek],
  };

  it('should create valid structure', () => {
    const result = createTemplateStructure(validProps);
    expect(result.isSuccess).toBe(true);
  });

  it('should fail if duration mismatch', () => {
    // This test doesn't really make sense with the new structure, so I'll update it
    const result = createTemplateStructure({
      duration: { type: 'fixed', weeks: -5 }, // Invalid negative value
      frequency: { type: 'fixed', workoutsPerWeek: 3 },
      weeks: [validWeek],
    });
    expect(result.isFailure).toBe(true);
  });

  it('should fail if workouts per week is invalid', () => {
    const result = createTemplateStructure({
      duration: { type: 'fixed', weeks: 4 },
      frequency: { type: 'fixed', workoutsPerWeek: 0 }, // Invalid 0 value
      weeks: [validWeek],
    });
    expect(result.isFailure).toBe(true);
  });

  it('should fail with invalid week structure', () => {
    const result = createTemplateStructure({
      duration: { type: 'fixed', weeks: 4 },
      frequency: { type: 'fixed', workoutsPerWeek: 3 },
      weeks: [{
        weekNumber: -1, // Invalid negative value
        workouts: []
      }],
    });
    expect(result.isFailure).toBe(true);
  });
});
