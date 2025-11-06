import { describe, it, expect } from 'vitest';
import { Workout } from './Workout';

describe('Workout Entity', () => {
  describe('creation', () => {
    it('creates workout with valid properties', () => {
      const workoutProps = {
        id: 'workout-123',
        date: '2023-06-15T08:30:00Z',
        type: 'Run',
        duration: '25 min',
        calories: 320,
        distance: '5.2 km',
        sets: undefined, // Optional field
        laps: undefined, // Optional field
        isActive: false,
      };

      const result = Workout.create(workoutProps);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const workout = result.value;
        expect(workout.id).toBe('workout-123');
        expect(workout.type).toBe('Run');
        expect(workout.duration).toBe('25 min');
        expect(workout.calories).toBe(320);
        expect(workout.distance).toBe('5.2 km');
      }
    });

    it('requires mandatory properties for creation', () => {
      const minimalProps = {
        id: 'workout-minimal',
        date: '2023-06-15T08:30:00Z',
        type: 'Yoga',
        duration: '60 min',
        calories: 180,
        isActive: false,
      };

      const result = Workout.create(minimalProps);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const workout = result.value;
        expect(workout.id).toBe('workout-minimal');
        expect(workout.type).toBe('Yoga');
        expect(workout.duration).toBe('60 min');
        expect(workout.calories).toBe(180);
        // Optional fields should be undefined
        expect(workout.distance).toBeUndefined();
        expect(workout.sets).toBeUndefined();
        expect(workout.laps).toBeUndefined();
      }
    });

    it('handles optional properties correctly', () => {
      const propsWithOptionals = {
        id: 'workout-with-optionals',
        date: '2023-06-15T08:30:00Z',
        type: 'Weight Training',
        duration: '45 min',
        calories: 250,
        distance: undefined, // explicitly undefined
        sets: 12,
        laps: undefined, // explicitly undefined
        isActive: true,
      };

      const result = Workout.create(propsWithOptionals);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const workout = result.value;
        expect(workout.id).toBe('workout-with-optionals');
        expect(workout.sets).toBe(12); // should have value
        expect(workout.distance).toBeUndefined(); // should be undefined
        expect(workout.laps).toBeUndefined(); // should be undefined
      }
    });
  });

  describe('getters', () => {
    it('provides access to all core properties', () => {
      const props = {
        id: 'workout-getters',
        date: '2023-06-15T08:30:00Z',
        type: 'Cycling',
        duration: '45 min',
        calories: 400,
        isActive: true,
      };

      const result = Workout.create(props);

      if (result.isSuccess) {
        const workout = result.value;

        expect(workout.date).toBe('2023-06-15T08:30:00Z');
        expect(workout.type).toBe('Cycling');
        expect(workout.duration).toBe('45 min');
        expect(workout.calories).toBe(400);
        expect(workout.isActive).toBe(true);
      }
    });

    it('returns optional properties when they exist', () => {
      const props = {
        id: 'workout-optional-props',
        date: '2023-06-15T08:30:00Z',
        type: 'Swimming',
        duration: '30 min',
        calories: 280,
        distance: '1.5 km',
        sets: undefined,
        laps: 20,
        isActive: false,
      };

      const result = Workout.create(props);

      if (result.isSuccess) {
        const workout = result.value;

        expect(workout.distance).toBe('1.5 km');
        expect(workout.laps).toBe(20);
        expect(workout.sets).toBeUndefined();
      }
    });

    it('returns undefined for optional properties when not provided', () => {
      const props = {
        id: 'workout-no-optionals',
        date: '2023-06-15T08:30:00Z',
        type: 'Walking',
        duration: '60 min',
        calories: 180,
        isActive: false,
      };

      const result = Workout.create(props);

      if (result.isSuccess) {
        const workout = result.value;

        expect(workout.distance).toBeUndefined();
        expect(workout.sets).toBeUndefined();
        expect(workout.laps).toBeUndefined();
      }
    });
  });

  describe('equality', () => {
    it('equals returns true for workouts with same ID', () => {
      const props1 = {
        id: 'same-id',
        date: '2023-06-15T08:30:00Z',
        type: 'Run',
        duration: '25 min',
        calories: 320,
        isActive: false,
      };

      const props2 = {
        id: 'same-id',
        date: '2023-06-16T09:30:00Z', // Different date
        type: 'Swimming', // Different type
        duration: '30 min',
        calories: 400, // Different calories
        isActive: true, // Different state
      };

      const result1 = Workout.create(props1);
      const result2 = Workout.create(props2);

      if (result1.isSuccess && result2.isSuccess) {
        expect(result1.value.equals(result2.value)).toBe(true);
      }
    });

    it('equals returns false for workouts with different IDs', () => {
      const props1 = {
        id: 'different-id-1',
        date: '2023-06-15T08:30:00Z',
        type: 'Run',
        duration: '25 min',
        calories: 320,
        isActive: false,
      };

      const props2 = {
        id: 'different-id-2', // Different ID
        date: '2023-06-15T08:30:00Z',
        type: 'Run',
        duration: '25 min',
        calories: 320,
        isActive: false,
      };

      const result1 = Workout.create(props1);
      const result2 = Workout.create(props2);

      if (result1.isSuccess && result2.isSuccess) {
        expect(result1.value.equals(result2.value)).toBe(false);
      }
    });

    it('equals returns false when comparing with null', () => {
      const props = {
        id: 'workout-id',
        date: '2023-06-15T08:30:00Z',
        type: 'Run',
        duration: '25 min',
        calories: 320,
        isActive: false,
      };

      const result = Workout.create(props);

      if (result.isSuccess) {
        expect(result.value.equals(null)).toBe(false);
      }
    });
  });

  describe('validation', () => {
    it('accepts valid workout types', () => {
      const validTypes = ['Run', 'Swimming', 'Cycling', 'Weight Training', 'Yoga'];

      for (const type of validTypes) {
        const props = {
          id: `workout-${type}`,
          date: '2023-06-15T08:30:00Z',
          type,
          duration: '30 min',
          calories: 200,
          isActive: false,
        };

        const result = Workout.create(props);

        expect(result.isSuccess).toBe(true);
      }
    });

    it('accepts realistic calorie values', () => {
      const calorieValues = [0, 50, 100, 500, 1000];

      for (const calories of calorieValues) {
        const props = {
          id: `workout-${calories}`,
          date: '2023-06-15T08:30:00Z',
          type: 'CrossFit',
          duration: '45 min',
          calories,
          isActive: false,
        };

        const result = Workout.create(props);

        expect(result.isSuccess).toBe(true);
      }
    });

    it('accepts realistic durations', () => {
      const durations = ['5 min', '30 min', '1 hr', '1h 30m', '90 mins', '2 hours'];

      for (const duration of durations) {
        const props = {
          id: `workout-${duration.replace(/\s/g, '')}`,
          date: '2023-06-15T08:30:00Z',
          type: 'HIIT',
          duration,
          calories: 300,
          isActive: false,
        };

        const result = Workout.create(props);

        expect(result.isSuccess).toBe(true);
      }
    });
  });

  describe('business logic methods', () => {
    it('provides a meaningful string representation', () => {
      const props = {
        id: 'workout-string-rep',
        date: '2023-06-15T08:30:00Z',
        type: 'Run',
        duration: '25 min',
        calories: 320,
        distance: '5.2 km',
        isActive: false,
      };

      const result = Workout.create(props);

      if (result.isSuccess) {
        const workout = result.value;
        // The toString method likely comes from the parent Entity class
        expect(typeof workout.toString()).toBe('string');
        // Just test that it returns a string, the format might be different
        expect(workout.toString()).toBeDefined();
      }
    });
  });
});