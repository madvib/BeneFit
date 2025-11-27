import { describe, it, expect } from 'vitest';
import { 
  createWorkoutActivity, 
  createWarmup,
  createIntervalSession,
  adjustForFatigue,
  getEstimatedDuration,
  isWarmup,
  hasStructure
} from './workout-activity.js';
import { 
  createActivityStructureWithIntervals,
  isIntervalBased as isStructureIntervalBased
} from '../activity-structure/activity-structure.js';

describe('WorkoutActivity Value Object', () => {
  it('should create a valid workout activity', () => {
    const result = createWorkoutActivity({
      name: 'Test Activity',
      type: 'main',
      order: 1
    });

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      const activity = result.value;
      expect(activity.name).toBe('Test Activity');
      expect(activity.type).toBe('main');
      expect(activity.order).toBe(1);
    }
  });

  it('should fail to create with empty name', () => {
    const result = createWorkoutActivity({
      name: '',
      type: 'main',
      order: 1
    });

    expect(result.isFailure).toBe(true);
  });

  it('should create warmup activity using factory method', () => {
    const result = createWarmup('Easy warmup', 10, 0);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      const activity = result.value;
      expect(activity.name).toBe('Easy warmup');
      expect(activity.type).toBe('warmup');
      expect(activity.duration).toBe(10);
      expect(isWarmup(activity)).toBe(true);
    }
  });

  it('should create interval activity with structure', () => {
    const intervals = [
      { duration: 30, intensity: 'hard' as const, rest: 10 }
    ];
    const structureResult = createActivityStructureWithIntervals(intervals);
    
    if (structureResult.isSuccess) {
      const structure = structureResult.value;
      const activityResult = createIntervalSession('Intervals', structure, 1);

      expect(activityResult.isSuccess).toBe(true);
      if (activityResult.isSuccess) {
        const activity = activityResult.value;
        expect(isStructureIntervalBased(structure)).toBe(true);
        expect(hasStructure(activity)).toBe(true);
      }
    }
  });

  it('should adjust for fatigue properly', () => {
    const result = createWorkoutActivity({
      name: 'Test Run',
      type: 'main',
      order: 1,
      duration: 30
    });

    if (result.isSuccess) {
      const activity = result.value;
      const adjustedResult = adjustForFatigue(activity, 0.7); // 70% fatigue

      expect(adjustedResult.isSuccess).toBe(true);
      if (adjustedResult.isSuccess) {
        const adjustedActivity = adjustedResult.value;
        // The adjusted activity should have shorter duration when fatigued
        expect(getEstimatedDuration(adjustedActivity)).toBeLessThanOrEqual(getEstimatedDuration(activity));
      }
    }
  });
});