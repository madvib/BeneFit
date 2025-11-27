import { describe, it, expect } from 'vitest';
import { 
  createActivityStructureWithIntervals, 
  createActivityStructureWithExercises, 
  createEmptyActivityStructure, 
  isIntervalBased,
  isExerciseBased,
  isEmpty,
  getTotalDuration,
  getTotalSets
} from './activity-structure.js';

describe('ActivityStructure Value Object', () => {
  it('should create with intervals successfully', () => {
    const intervals = [
      { duration: 30, intensity: 'hard' as const, rest: 10 }
    ];
    
    const result = createActivityStructureWithIntervals(intervals);
    
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      const structure = result.value;
      expect(isIntervalBased(structure)).toBe(true);
      expect(isEmpty(structure)).toBe(false);
      expect(getTotalDuration(structure)).toBeGreaterThan(0);
    }
  });

  it('should create with exercises successfully', () => {
    const exercises = [
      { name: 'Push-up', sets: 3, reps: 10, rest: 60 }
    ];
    
    const result = createActivityStructureWithExercises(exercises);
    
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      const structure = result.value;
      expect(isExerciseBased(structure)).toBe(true);
      expect(isEmpty(structure)).toBe(false);
      expect(getTotalSets(structure)).toBeGreaterThan(0);
    }
  });

  it('should create empty structure', () => {
    const structure = createEmptyActivityStructure();
    
    expect(isEmpty(structure)).toBe(true);
    expect(isIntervalBased(structure)).toBe(false);
    expect(isExerciseBased(structure)).toBe(false);
  });

  it('should fail with negative interval duration', () => {
    const intervals = [
      { duration: -10, intensity: 'hard' as const, rest: 10 }
    ];
    
    const result = createActivityStructureWithIntervals(intervals);
    
    expect(result.isFailure).toBe(true);
  });

  it('should fail with negative exercise sets', () => {
    const exercises = [
      { name: 'Push-up', sets: -1, reps: 10, rest: 60 }
    ];
    
    const result = createActivityStructureWithExercises(exercises);
    
    expect(result.isFailure).toBe(true);
  });
});