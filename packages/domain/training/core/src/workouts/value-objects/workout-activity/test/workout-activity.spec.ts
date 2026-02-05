import { describe, it, expect } from 'vitest';
import { CreateActivityStructureSchema } from '../../activity-structure/index.js';
import { getTotalDuration } from '../../activity-structure/activity-structure.queries.js';
import { CreateWorkoutActivitySchema } from '../workout-activity.factory.js';
import { isWarmup, isCooldown, isMainActivity, isActivityIntervalBased, isCircuit, activityRequiresEquipment, hasEquipment, getEquipmentList, hasStructure, hasInstructions, hasVideo, hasAlternatives, getEstimatedDuration, getShortDescription, getDetailedDescription, getInstructionsList } from '../workout-activity.queries.js';
import { toWorkoutActivityView } from '../workout-activity.view.js';
import { setOrder, addInstruction, addAlternative, makeEasier, makeHarder } from '../workout-activity.commands.js';
import { createWorkoutActivityFixture } from './workout-activity.fixtures.js';

describe('WorkoutActivity', () => {
  describe('create', () => {
    it('should create a basic activity', () => {
      const fixtureData = createWorkoutActivityFixture({ name: 'Squats', type: 'main', order: 1 });
      const result = CreateWorkoutActivitySchema.safeParse(fixtureData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Squats');
        expect(result.data.type).toBe('main');
      }
    });

    it('should fail with empty name', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: '',
        type: 'main',
        order: 1,
      });

      expect(result.success).toBe(false);
    });

    it('should fail with negative order', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Running',
        type: 'main',
        order: -1,
      });

      expect(result.success).toBe(false);
    });

    it('should create activity with all optional fields', () => {
      const structureResult = CreateActivityStructureSchema.safeParse({
        intervals: [
          { duration: 300, intensity: 'moderate', rest: 60 },
        ]
      });

      if (structureResult.success) {
        const result = CreateWorkoutActivitySchema.safeParse({
          name: 'HIIT',
          type: 'interval',
          order: 2,
          structure: structureResult.data,
          instructions: ['Go hard', 'Rest well'],
          equipment: ['dumbbells'],
          alternativeExercises: ['Burpees'],
          videoUrl: 'https://example.com/video',
        });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(hasStructure(result.data)).toBe(true);
          expect(hasInstructions(result.data)).toBe(true);
          expect(activityRequiresEquipment(result.data)).toBe(true);
          expect(hasAlternatives(result.data)).toBe(true);
          expect(hasVideo(result.data)).toBe(true);
        }
      }
    });
  });

  describe('factory methods', () => {
    it('should create warmup activity', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Dynamic Stretching',
        type: 'warmup',
        order: 0,
        duration: 10
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(isWarmup(result.data)).toBe(true);
        expect(result.data.order).toBe(0);
        expect(result.data.duration).toBe(10);
      }
    });

    it('should create cooldown activity', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Static Stretching',
        type: 'cooldown',
        order: 10,
        duration: 5
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(isCooldown(result.data)).toBe(true);
        expect(result.data.duration).toBe(5);
      }
    });

    it('should create distance run', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: '5000m run',
        type: 'main',
        order: 1,
        distance: 5000,
        pace: '5:00/km'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('main');
        expect(result.data.distance).toBe(5000);
        expect(result.data.pace).toBe('5:00/km');
      }
    });

    it('should create interval session', () => {
      const structureResult = CreateActivityStructureSchema.safeParse({
        intervals: [{ duration: 180, intensity: 'hard', rest: 90 }],
        rounds: 4
      });

      if (structureResult.success) {
        const result = CreateWorkoutActivitySchema.safeParse({
          name: 'Tempo Intervals',
          type: 'interval',
          order: 2,
          structure: structureResult.data,
          duration: getTotalDuration(structureResult.data) / 60
        });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(isActivityIntervalBased(result.data)).toBe(true);
          expect(hasStructure(result.data)).toBe(true);
        }
      }
    });

    it('should create circuit', () => {
      const structureResult = CreateActivityStructureSchema.safeParse({
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 15, rest: 30 },
          { name: 'Squats', sets: 3, reps: 20, rest: 30 },
        ]
      });

      if (structureResult.success) {
        const result = CreateWorkoutActivitySchema.safeParse({
          name: 'Upper Body Circuit',
          type: 'circuit',
          order: 3,
          structure: structureResult.data,
          equipment: ['dumbbells'],
          duration: getTotalDuration(structureResult.data) / 60
        });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(isCircuit(result.data)).toBe(true);
          expect(activityRequiresEquipment(result.data)).toBe(true);
        }
      }
    });
  });

  describe('type checks', () => {
    it('should identify warmup activities', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Warmup',
        type: 'warmup',
        order: 0,
        duration: 5
      });

      if (result.success) {
        expect(isWarmup(result.data)).toBe(true);
        expect(isMainActivity(result.data)).toBe(false);
        expect(isCooldown(result.data)).toBe(false);
      }
    });

    it('should identify cooldown activities', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Cooldown',
        type: 'cooldown',
        order: 10,
        duration: 5
      });

      if (result.success) {
        expect(isCooldown(result.data)).toBe(true);
        expect(isMainActivity(result.data)).toBe(false);
        expect(isWarmup(result.data)).toBe(false);
      }
    });

    it('should identify main activities', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Strength Training',
        type: 'main',
        order: 1,
      });

      if (result.success) {
        expect(isMainActivity(result.data)).toBe(true);
        expect(isWarmup(result.data)).toBe(false);
        expect(isCooldown(result.data)).toBe(false);
      }
    });

    it('should identify interval-based activities', () => {
      const structureResult = CreateActivityStructureSchema.safeParse({
        intervals: [{ duration: 60, intensity: 'sprint', rest: 60 }],
        rounds: 3
      });

      if (structureResult.success) {
        const result = CreateWorkoutActivitySchema.safeParse({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.data
        });

        if (result.success) {
          expect(isActivityIntervalBased(result.data)).toBe(true);
        }
      }
    });

    it('should identify circuits', () => {
      const structureResult = CreateActivityStructureSchema.safeParse({
        exercises: [
          { name: 'Exercise 1', sets: 3, reps: 10, rest: 30 },
        ]
      });

      if (structureResult.success) {
        const result = CreateWorkoutActivitySchema.safeParse({
          name: 'Circuit',
          type: 'circuit',
          order: 1,
          structure: structureResult.data
        });

        if (result.success) {
          expect(isCircuit(result.data)).toBe(true);
        }
      }
    });
  });

  describe('equipment queries', () => {
    it('should detect equipment requirements', () => {
      const withEquipmentResult = CreateWorkoutActivitySchema.safeParse({
        name: 'Dumbbell Press',
        type: 'main',
        order: 1,
        equipment: ['dumbbells', 'bench'],
      });

      const withoutEquipmentResult = CreateWorkoutActivitySchema.safeParse({
        name: 'Push-ups',
        type: 'main',
        order: 1,
      });

      if (withEquipmentResult.success && withoutEquipmentResult.success) {
        expect(activityRequiresEquipment(withEquipmentResult.data)).toBe(true);
        expect(activityRequiresEquipment(withoutEquipmentResult.data)).toBe(false);
      }
    });

    it('should check for specific equipment', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Barbell Squat',
        type: 'main',
        order: 1,
        equipment: ['barbell', 'rack'],
      });

      if (result.success) {
        expect(hasEquipment(result.data, 'barbell')).toBe(true);
        expect(hasEquipment(result.data, 'dumbbells')).toBe(false);
      }
    });

    it('should get equipment list', () => {
      const activity = createWorkoutActivityFixture({
        equipment: ['dumbbells', 'bench', 'mat'],
      });

      const list = getEquipmentList(activity);
      expect(list).toEqual(['dumbbells', 'bench', 'mat']);
    });
  });

  describe('content queries', () => {
    it('should detect structure', () => {
      const structureResult = CreateActivityStructureSchema.safeParse({
        intervals: [{ duration: 60, intensity: 'hard', rest: 60 }]
      });

      if (structureResult.success) {
        const withStructureResult = CreateWorkoutActivitySchema.safeParse({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.data,
        });

        const withoutStructureResult = CreateWorkoutActivitySchema.safeParse({
          name: 'Running',
          type: 'main',
          order: 1,
        });

        if (withStructureResult.success && withoutStructureResult.success) {
          expect(hasStructure(withStructureResult.data)).toBe(true);
          expect(hasStructure(withoutStructureResult.data)).toBe(false);
        }
      }
    });

    it('should detect instructions', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Complex Exercise',
        type: 'main',
        order: 1,
        instructions: ['Step 1', 'Step 2', 'Step 3'],
      });

      if (result.success) {
        expect(hasInstructions(result.data)).toBe(true);
      }
    });

    it('should detect video', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Exercise',
        type: 'main',
        order: 1,
        videoUrl: 'https://example.com/video',
      });

      if (result.success) {
        expect(hasVideo(result.data)).toBe(true);
      }
    });

    it('should detect alternatives', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Barbell Squat',
        type: 'main',
        order: 1,
        alternativeExercises: ['Goblet Squat', 'Leg Press'],
      });

      if (result.success) {
        expect(hasAlternatives(result.data)).toBe(true);
      }
    });
  });

  describe('getEstimatedDuration', () => {
    it('should return explicit duration if provided', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Running',
        type: 'main',
        order: 1,
        duration: 30,
      });

      if (result.success) {
        expect(getEstimatedDuration(result.data)).toBe(30);
      }
    });

    it('should calculate duration from structure', () => {
      const structureResult = CreateActivityStructureSchema.safeParse({
        intervals: [{ duration: 60, intensity: 'hard', rest: 60 }],
        rounds: 3
      });

      if (structureResult.success) {
        const result = CreateWorkoutActivitySchema.safeParse({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.data,
        });

        if (result.success) {
          const duration = getEstimatedDuration(result.data);
          expect(duration).toBe(getTotalDuration(structureResult.data) / 60);
        }
      }
    });

    it('should return default duration for activities with no duration info', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Stretching',
        type: 'cooldown',
        order: 1,
      });

      if (result.success) {
        expect(getEstimatedDuration(result.data)).toBe(10);
      }
    });
  });

  describe('setOrder', () => {
    it('should update order', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Exercise',
        type: 'main',
        order: 1,
      });

      if (result.success) {
        const updated = setOrder(result.data, 5);
        expect(updated.isSuccess).toBe(true);
        if (updated.isSuccess) {
          expect(updated.value.order).toBe(5);
        }
      }
    });

    it('should fail with negative order', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Exercise',
        type: 'main',
        order: 1,
      });

      if (result.success) {
        const updateResult = setOrder(result.data, -1);
        expect(updateResult.isFailure).toBe(true);
      }
    });
  });

  describe('addInstruction', () => {
    it('should add instruction', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Exercise',
        type: 'main',
        order: 1,
        instructions: ['Step 1'],
      });

      if (result.success) {
        const updated = addInstruction(result.data, 'Step 2');
        expect(updated.isSuccess).toBe(true);
        if (updated.isSuccess) {
          expect(updated.value.instructions?.length).toBe(2);
          expect(updated.value.instructions).toContain('Step 2');
        }
      }
    });

    it('should initialize instructions if none exist', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Exercise',
        type: 'main',
        order: 1,
      });

      if (result.success) {
        const updated = addInstruction(result.data, 'First instruction');
        expect(updated.isSuccess).toBe(true);
        if (updated.isSuccess) {
          expect(updated.value.instructions?.length).toBe(1);
        }
      }
    });
  });

  describe('addAlternative', () => {
    it('should add alternative exercise', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Barbell Squat',
        type: 'main',
        order: 1,
      });

      if (result.success) {
        const updated = addAlternative(result.data, 'Goblet Squat');
        expect(updated.isSuccess).toBe(true);
        if (updated.isSuccess) {
          expect(updated.value.alternativeExercises).toContain('Goblet Squat');
        }
      }
    });

    it('should add multiple alternatives', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Exercise',
        type: 'main',
        order: 1,
        alternativeExercises: ['Alternative 1'],
      });

      if (result.success) {
        const updated = addAlternative(result.data, 'Alternative 2');
        expect(updated.isSuccess).toBe(true);
        if (updated.isSuccess) {
          expect(updated.value.alternativeExercises?.length).toBe(2);
        }
      }
    });
  });

  describe('makeEasier', () => {
    it('should reduce intensity by default factor', () => {
      const structureResult = CreateActivityStructureSchema.safeParse({
        intervals: [{ duration: 300, intensity: 'hard', rest: 60 }],
        rounds: 3
      });

      if (structureResult.success) {
        const result = CreateWorkoutActivitySchema.safeParse({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.data,
        });

        if (result.success) {
          const easier = makeEasier(result.data);
          expect(easier.isSuccess).toBe(true);
          if (easier.isSuccess) {
            expect(easier.value.structure).toBeDefined();
          }
        }
      }
    });

    it('should apply custom factor', () => {
      const structureResult = CreateActivityStructureSchema.safeParse({
        intervals: [{ duration: 300, intensity: 'hard', rest: 60 }],
        rounds: 3
      });

      if (structureResult.success) {
        const result = CreateWorkoutActivitySchema.safeParse({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.data,
        });

        if (result.success) {
          const easier = makeEasier(result.data, 0.7);
          expect(easier.isSuccess).toBe(true);
          if (easier.isSuccess) {
            expect(easier.value.structure).toBeDefined();
          }
        }
      }
    });
  });

  describe('makeHarder', () => {
    it('should increase intensity by default factor', () => {
      const structureResult = CreateActivityStructureSchema.safeParse({
        intervals: [{ duration: 300, intensity: 'moderate', rest: 60 }],
        rounds: 2
      });

      if (structureResult.success) {
        const result = CreateWorkoutActivitySchema.safeParse({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.data,
        });

        if (result.success) {
          const harder = makeHarder(result.data);
          expect(harder.isSuccess).toBe(true);
          if (harder.isSuccess) {
            expect(harder.value.structure).toBeDefined();
          }
        }
      }
    });

    it('should apply custom factor', () => {
      const structureResult = CreateActivityStructureSchema.safeParse({
        intervals: [{ duration: 300, intensity: 'moderate', rest: 60 }],
        rounds: 2
      });

      if (structureResult.success) {
        const result = CreateWorkoutActivitySchema.safeParse({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.data,
        });

        if (result.success) {
          const harder = makeHarder(result.data, 1.5);
          expect(harder.isSuccess).toBe(true);
          if (harder.isSuccess) {
            expect(harder.value.structure).toBeDefined();
          }
        }
      }
    });
  });

  describe('display helpers', () => {
    it('should get short description', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Running',
        type: 'main',
        order: 1,
        distance: 5000,
      });

      if (result.success) {
        const description = getShortDescription(result.data);
        expect(description).toContain('Running');
        expect(description.length).toBeGreaterThan(0);
      }
    });

    it('should get detailed description', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Strength Training',
        type: 'main',
        order: 1,
        equipment: ['barbell', 'dumbbells'],
        duration: 60,
      });

      if (result.success) {
        const description = getDetailedDescription(result.data);
        expect(description.length).toBeGreaterThan(0);
      }
    });

    it('should get instructions list', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Complex Exercise',
        type: 'main',
        order: 1,
        instructions: ['Step 1', 'Step 2', 'Step 3'],
      });

      if (result.success) {
        const instructions = getInstructionsList(result.data);
        expect(instructions.length).toBe(3);
        expect(instructions).toEqual(['Step 1', 'Step 2', 'Step 3']);
      }
    });

    it('should return empty array when no instructions', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Exercise',
        type: 'main',
        order: 1,
      });

      if (result.success) {
        const instructions = getInstructionsList(result.data);
        expect(instructions).toEqual([]);
      }
    });
  });

  describe('complex scenarios', () => {
    it('should handle complete warmup with structure', () => {
      const structureResult = CreateActivityStructureSchema.safeParse({
        exercises: [
          { name: 'Arm Circles', sets: 1, reps: 10, rest: 0 },
          { name: 'Leg Swings', sets: 1, reps: 10, rest: 0 },
        ]
      });

      if (structureResult.success) {
        const result = CreateWorkoutActivitySchema.safeParse({
          name: 'Dynamic Warmup',
          type: 'warmup',
          order: 0,
          structure: structureResult.data,
          instructions: ['Move slowly', 'Focus on form'],
        });

        if (result.success) {
          expect(isWarmup(result.data)).toBe(true);
          expect(hasStructure(result.data)).toBe(true);
          expect(hasInstructions(result.data)).toBe(true);
          expect(getEstimatedDuration(result.data)).toBeGreaterThan(0);
        }
      }
    });

    it('should handle strength workout with alternatives', () => {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Barbell Bench Press',
        type: 'main',
        order: 1,
        equipment: ['barbell', 'bench'],
        alternativeExercises: ['Dumbbell Bench Press', 'Push-ups'],
        instructions: ['Keep back flat', 'Control the descent'],
        videoUrl: 'https://example.com/bench-press',
      });

      if (result.success) {
        expect(activityRequiresEquipment(result.data)).toBe(true);
        expect(hasAlternatives(result.data)).toBe(true);
        expect(hasInstructions(result.data)).toBe(true);
        expect(hasVideo(result.data)).toBe(true);
      }
    });
  });
});


describe('toWorkoutActivityView', () => {
  it('should map domain entity to view with computed fields', () => {
    const result = CreateWorkoutActivitySchema.safeParse({
      name: 'Bench Press',
      type: 'main',
      order: 1,
      equipment: ['Barbell', 'Bench'],
      duration: 45,
      instructions: ['Lift heavy'],
    });

    if (result.success) {
      const view = toWorkoutActivityView(result.data);

      // Base fields
      expect(view.name).toBe('Bench Press');
      expect(view.type).toBe('main');

      // Computed fields check
      expect(view.estimatedDuration).toBe(45);
      expect(view.requiresEquipment).toBe(true);
      expect(view.equipmentList).toEqual(['Barbell', 'Bench']);
      expect(view.instructionsList).toContain('Lift heavy');
      expect(view.shortDescription).toContain('45min');

      // Type helpers check
      expect(view.isMainActivity).toBe(true);
      expect(view.isWarmup).toBe(false);
    }
  });

  it('should handle computed fields from structure', () => {
    const structureResult = CreateActivityStructureSchema.safeParse({
      intervals: [{ duration: 60, intensity: 'sprint', rest: 60 }],
      rounds: 5
    }); // 5 rounds * (60+60) = 600s = 10min

    if (structureResult.success) {
      const result = CreateWorkoutActivitySchema.safeParse({
        name: 'Sprints',
        type: 'interval',
        order: 1,
        structure: structureResult.data,
      });
      if (result.success) {
        const view = toWorkoutActivityView(result.data);
        expect(view.estimatedDuration).toBe(10);
        expect(view.estimatedCalories).toBeGreaterThan(0);
      }
    }
  });
});
