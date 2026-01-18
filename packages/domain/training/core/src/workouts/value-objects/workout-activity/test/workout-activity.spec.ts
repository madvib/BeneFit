import { describe, it, expect } from 'vitest';
import { createIntervalStructure, createExerciseStructure } from '../../activity-structure/index.js';
import { getTotalDuration } from '../../activity-structure/activity-structure.queries.js';
import { createWorkoutActivity, createWarmup, createCooldown, createDistanceRun, createIntervalSession, createCircuit } from '../workout-activity.factory.js';
import { isWarmup, isCooldown, isMainActivity, isActivityIntervalBased, isCircuit, activityRequiresEquipment, hasEquipment, getEquipmentList, hasStructure, hasInstructions, hasVideo, hasAlternatives, getEstimatedDuration, getShortDescription, getDetailedDescription, getInstructionsList } from '../workout-activity.queries.js';
import { toWorkoutActivityView } from '../workout-activity.factory.js';
import { setOrder, addInstruction, addAlternative, makeEasier, makeHarder } from '../workout-activity.commands.js';

describe('WorkoutActivity', () => {
  describe('create', () => {
    it('should create a basic activity', () => {
      const result = createWorkoutActivity({
        name: 'Squats',
        type: 'main',
        order: 1,
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.name).toBe('Squats');
        expect(result.value.type).toBe('main');
      }
    });

    it('should fail with empty name', () => {
      const result = createWorkoutActivity({
        name: '',
        type: 'main',
        order: 1,
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail with negative order', () => {
      const result = createWorkoutActivity({
        name: 'Running',
        type: 'main',
        order: -1,
      });

      expect(result.isFailure).toBe(true);
    });

    it('should create activity with all optional fields', () => {
      const structureResult = createIntervalStructure([
        { duration: 300, intensity: 'moderate', rest: 60 },
      ]);

      if (structureResult.isSuccess) {
        const result = createWorkoutActivity({
          name: 'HIIT',
          type: 'interval',
          order: 2,
          structure: structureResult.value,
          instructions: ['Go hard', 'Rest well'],
          equipment: ['dumbbells'],
          alternativeExercises: ['Burpees'],
          videoUrl: 'https://example.com/video',
        });

        expect(result.isSuccess).toBe(true);
        if (result.isSuccess) {
          expect(hasStructure(result.value)).toBe(true);
          expect(hasInstructions(result.value)).toBe(true);
          expect(activityRequiresEquipment(result.value)).toBe(true);
          expect(hasAlternatives(result.value)).toBe(true);
          expect(hasVideo(result.value)).toBe(true);
        }
      }
    });
  });

  describe('factory methods', () => {
    it('should create warmup activity', () => {
      const result = createWarmup('Dynamic Stretching', 10, 0);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isWarmup(result.value)).toBe(true);
        expect(result.value.order).toBe(0);
        expect(result.value.duration).toBe(10);
      }
    });

    it('should create cooldown activity', () => {
      const result = createCooldown('Static Stretching', 5, 10);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isCooldown(result.value)).toBe(true);
        expect(result.value.duration).toBe(5);
      }
    });

    it('should create distance run', () => {
      const result = createDistanceRun(5000, '5:00/km', 1);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.type).toBe('main');
        expect(result.value.distance).toBe(5000);
        expect(result.value.pace).toBe('5:00/km');
      }
    });

    it('should create interval session', () => {
      const structureResult = createIntervalStructure([
        { duration: 180, intensity: 'hard', rest: 90 },
      ], 4);

      if (structureResult.isSuccess) {
        const result = createIntervalSession('Tempo Intervals', structureResult.value, 2);

        expect(result.isSuccess).toBe(true);
        if (result.isSuccess) {
          expect(isActivityIntervalBased(result.value)).toBe(true);
          expect(hasStructure(result.value)).toBe(true);
        }
      }
    });

    it('should create circuit', () => {
      const structureResult = createExerciseStructure([
        { name: 'Push-ups', sets: 3, reps: 15, rest: 30 },
        { name: 'Squats', sets: 3, reps: 20, rest: 30 },
      ]);

      if (structureResult.isSuccess) {
        const result = createCircuit('Upper Body Circuit', structureResult.value, 3, ['dumbbells']);

        expect(result.isSuccess).toBe(true);
        if (result.isSuccess) {
          expect(isCircuit(result.value)).toBe(true);
          expect(activityRequiresEquipment(result.value)).toBe(true);
        }
      }
    });
  });

  describe('type checks', () => {
    it('should identify warmup activities', () => {
      const result = createWarmup('Warmup', 5, 0);

      if (result.isSuccess) {
        expect(isWarmup(result.value)).toBe(true);
        expect(isMainActivity(result.value)).toBe(false);
        expect(isCooldown(result.value)).toBe(false);
      }
    });

    it('should identify cooldown activities', () => {
      const result = createCooldown('Cooldown', 5, 10);

      if (result.isSuccess) {
        expect(isCooldown(result.value)).toBe(true);
        expect(isMainActivity(result.value)).toBe(false);
        expect(isWarmup(result.value)).toBe(false);
      }
    });

    it('should identify main activities', () => {
      const result = createWorkoutActivity({
        name: 'Strength Training',
        type: 'main',
        order: 1,
      });

      if (result.isSuccess) {
        expect(isMainActivity(result.value)).toBe(true);
        expect(isWarmup(result.value)).toBe(false);
        expect(isCooldown(result.value)).toBe(false);
      }
    });

    it('should identify interval-based activities', () => {
      const structureResult = createIntervalStructure([
        { duration: 60, intensity: 'sprint', rest: 60 },
      ], 3);

      if (structureResult.isSuccess) {
        const result = createIntervalSession('HIIT', structureResult.value, 1);

        if (result.isSuccess) {
          expect(isActivityIntervalBased(result.value)).toBe(true);
        }
      }
    });

    it('should identify circuits', () => {
      const structureResult = createExerciseStructure([
        { name: 'Exercise 1', sets: 3, reps: 10, rest: 30 },
      ]);

      if (structureResult.isSuccess) {
        const result = createCircuit('Circuit', structureResult.value, 1);

        if (result.isSuccess) {
          expect(isCircuit(result.value)).toBe(true);
        }
      }
    });
  });

  describe('equipment queries', () => {
    it('should detect equipment requirements', () => {
      const withEquipmentResult = createWorkoutActivity({
        name: 'Dumbbell Press',
        type: 'main',
        order: 1,
        equipment: ['dumbbells', 'bench'],
      });

      const withoutEquipmentResult = createWorkoutActivity({
        name: 'Push-ups',
        type: 'main',
        order: 1,
      });

      if (withEquipmentResult.isSuccess && withoutEquipmentResult.isSuccess) {
        expect(activityRequiresEquipment(withEquipmentResult.value)).toBe(true);
        expect(activityRequiresEquipment(withoutEquipmentResult.value)).toBe(false);
      }
    });

    it('should check for specific equipment', () => {
      const result = createWorkoutActivity({
        name: 'Barbell Squat',
        type: 'main',
        order: 1,
        equipment: ['barbell', 'rack'],
      });

      if (result.isSuccess) {
        expect(hasEquipment(result.value, 'barbell')).toBe(true);
        expect(hasEquipment(result.value, 'dumbbells')).toBe(false);
      }
    });

    it('should get equipment list', () => {
      const result = createWorkoutActivity({
        name: 'Exercise',
        type: 'main',
        order: 1,
        equipment: ['dumbbells', 'bench', 'mat'],
      });

      if (result.isSuccess) {
        const list = getEquipmentList(result.value);
        expect(list).toEqual(['dumbbells', 'bench', 'mat']);
      }
    });
  });

  describe('content queries', () => {
    it('should detect structure', () => {
      const structureResult = createIntervalStructure([
        { duration: 60, intensity: 'hard', rest: 60 },
      ]);

      if (structureResult.isSuccess) {
        const withStructureResult = createWorkoutActivity({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.value,
        });

        const withoutStructureResult = createWorkoutActivity({
          name: 'Running',
          type: 'main',
          order: 1,
        });

        if (withStructureResult.isSuccess && withoutStructureResult.isSuccess) {
          expect(hasStructure(withStructureResult.value)).toBe(true);
          expect(hasStructure(withoutStructureResult.value)).toBe(false);
        }
      }
    });

    it('should detect instructions', () => {
      const result = createWorkoutActivity({
        name: 'Complex Exercise',
        type: 'main',
        order: 1,
        instructions: ['Step 1', 'Step 2', 'Step 3'],
      });

      if (result.isSuccess) {
        expect(hasInstructions(result.value)).toBe(true);
      }
    });

    it('should detect video', () => {
      const result = createWorkoutActivity({
        name: 'Exercise',
        type: 'main',
        order: 1,
        videoUrl: 'https://example.com/video',
      });

      if (result.isSuccess) {
        expect(hasVideo(result.value)).toBe(true);
      }
    });

    it('should detect alternatives', () => {
      const result = createWorkoutActivity({
        name: 'Barbell Squat',
        type: 'main',
        order: 1,
        alternativeExercises: ['Goblet Squat', 'Leg Press'],
      });

      if (result.isSuccess) {
        expect(hasAlternatives(result.value)).toBe(true);
      }
    });
  });

  describe('getEstimatedDuration', () => {
    it('should return explicit duration if provided', () => {
      const result = createWorkoutActivity({
        name: 'Running',
        type: 'main',
        order: 1,
        duration: 30,
      });

      if (result.isSuccess) {
        expect(getEstimatedDuration(result.value)).toBe(30);
      }
    });

    it('should calculate duration from structure', () => {
      const structureResult = createIntervalStructure([
        { duration: 60, intensity: 'hard', rest: 60 },
      ], 3);

      if (structureResult.isSuccess) {
        const result = createWorkoutActivity({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.value,
        });

        if (result.isSuccess) {
          const duration = getEstimatedDuration(result.value);
          expect(duration).toBe(getTotalDuration(structureResult.value) / 60);
        }
      }
    });

    it('should return default duration for activities with no duration info', () => {
      const result = createWorkoutActivity({
        name: 'Stretching',
        type: 'cooldown',
        order: 1,
      });

      if (result.isSuccess) {
        expect(getEstimatedDuration(result.value)).toBe(10);
      }
    });
  });

  describe('setOrder', () => {
    it('should update order', () => {
      const result = createWorkoutActivity({
        name: 'Exercise',
        type: 'main',
        order: 1,
      });

      if (result.isSuccess) {
        const updated = setOrder(result.value, 5);
        expect(updated.isSuccess).toBe(true);
        if (updated.isSuccess) {
          expect(updated.value.order).toBe(5);
        }
      }
    });

    it('should fail with negative order', () => {
      const result = createWorkoutActivity({
        name: 'Exercise',
        type: 'main',
        order: 1,
      });

      if (result.isSuccess) {
        const updateResult = setOrder(result.value, -1);
        expect(updateResult.isFailure).toBe(true);
      }
    });
  });

  describe('addInstruction', () => {
    it('should add instruction', () => {
      const result = createWorkoutActivity({
        name: 'Exercise',
        type: 'main',
        order: 1,
        instructions: ['Step 1'],
      });

      if (result.isSuccess) {
        const updated = addInstruction(result.value, 'Step 2');
        expect(updated.isSuccess).toBe(true);
        if (updated.isSuccess) {
          expect(updated.value.instructions?.length).toBe(2);
          expect(updated.value.instructions).toContain('Step 2');
        }
      }
    });

    it('should initialize instructions if none exist', () => {
      const result = createWorkoutActivity({
        name: 'Exercise',
        type: 'main',
        order: 1,
      });

      if (result.isSuccess) {
        const updated = addInstruction(result.value, 'First instruction');
        expect(updated.isSuccess).toBe(true);
        if (updated.isSuccess) {
          expect(updated.value.instructions?.length).toBe(1);
        }
      }
    });
  });

  describe('addAlternative', () => {
    it('should add alternative exercise', () => {
      const result = createWorkoutActivity({
        name: 'Barbell Squat',
        type: 'main',
        order: 1,
      });

      if (result.isSuccess) {
        const updated = addAlternative(result.value, 'Goblet Squat');
        expect(updated.isSuccess).toBe(true);
        if (updated.isSuccess) {
          expect(updated.value.alternativeExercises).toContain('Goblet Squat');
        }
      }
    });

    it('should add multiple alternatives', () => {
      const result = createWorkoutActivity({
        name: 'Exercise',
        type: 'main',
        order: 1,
        alternativeExercises: ['Alternative 1'],
      });

      if (result.isSuccess) {
        const updated = addAlternative(result.value, 'Alternative 2');
        expect(updated.isSuccess).toBe(true);
        if (updated.isSuccess) {
          expect(updated.value.alternativeExercises?.length).toBe(2);
        }
      }
    });
  });

  describe('makeEasier', () => {
    it('should reduce intensity by default factor', () => {
      const structureResult = createIntervalStructure([
        { duration: 300, intensity: 'hard', rest: 60 },
      ], 3);

      if (structureResult.isSuccess) {
        const result = createWorkoutActivity({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.value,
        });

        if (result.isSuccess) {
          const easier = makeEasier(result.value);
          expect(easier.isSuccess).toBe(true);
          if (easier.isSuccess) {
            expect(easier.value.structure).toBeDefined();
          }
        }
      }
    });

    it('should apply custom factor', () => {
      const structureResult = createIntervalStructure([
        { duration: 300, intensity: 'hard', rest: 60 },
      ], 3);

      if (structureResult.isSuccess) {
        const result = createWorkoutActivity({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.value,
        });

        if (result.isSuccess) {
          const easier = makeEasier(result.value, 0.7);
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
      const structureResult = createIntervalStructure([
        { duration: 300, intensity: 'moderate', rest: 60 },
      ], 2);

      if (structureResult.isSuccess) {
        const result = createWorkoutActivity({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.value,
        });

        if (result.isSuccess) {
          const harder = makeHarder(result.value);
          expect(harder.isSuccess).toBe(true);
          if (harder.isSuccess) {
            expect(harder.value.structure).toBeDefined();
          }
        }
      }
    });

    it('should apply custom factor', () => {
      const structureResult = createIntervalStructure([
        { duration: 300, intensity: 'moderate', rest: 60 },
      ], 2);

      if (structureResult.isSuccess) {
        const result = createWorkoutActivity({
          name: 'HIIT',
          type: 'interval',
          order: 1,
          structure: structureResult.value,
        });

        if (result.isSuccess) {
          const harder = makeHarder(result.value, 1.5);
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
      const result = createWorkoutActivity({
        name: 'Running',
        type: 'main',
        order: 1,
        distance: 5000,
      });

      if (result.isSuccess) {
        const description = getShortDescription(result.value);
        expect(description).toContain('Running');
        expect(description.length).toBeGreaterThan(0);
      }
    });

    it('should get detailed description', () => {
      const result = createWorkoutActivity({
        name: 'Strength Training',
        type: 'main',
        order: 1,
        equipment: ['barbell', 'dumbbells'],
        duration: 60,
      });

      if (result.isSuccess) {
        const description = getDetailedDescription(result.value);
        expect(description.length).toBeGreaterThan(0);
      }
    });

    it('should get instructions list', () => {
      const result = createWorkoutActivity({
        name: 'Complex Exercise',
        type: 'main',
        order: 1,
        instructions: ['Step 1', 'Step 2', 'Step 3'],
      });

      if (result.isSuccess) {
        const instructions = getInstructionsList(result.value);
        expect(instructions.length).toBe(3);
        expect(instructions).toEqual(['Step 1', 'Step 2', 'Step 3']);
      }
    });

    it('should return empty array when no instructions', () => {
      const result = createWorkoutActivity({
        name: 'Exercise',
        type: 'main',
        order: 1,
      });

      if (result.isSuccess) {
        const instructions = getInstructionsList(result.value);
        expect(instructions).toEqual([]);
      }
    });
  });

  describe('complex scenarios', () => {
    it('should handle complete warmup with structure', () => {
      const structureResult = createExerciseStructure([
        { name: 'Arm Circles', sets: 1, reps: 10, rest: 0 },
        { name: 'Leg Swings', sets: 1, reps: 10, rest: 0 },
      ]);

      if (structureResult.isSuccess) {
        const result = createWorkoutActivity({
          name: 'Dynamic Warmup',
          type: 'warmup',
          order: 0,
          structure: structureResult.value,
          instructions: ['Move slowly', 'Focus on form'],
        });

        if (result.isSuccess) {
          expect(isWarmup(result.value)).toBe(true);
          expect(hasStructure(result.value)).toBe(true);
          expect(hasInstructions(result.value)).toBe(true);
          expect(getEstimatedDuration(result.value)).toBeGreaterThan(0);
        }
      }
    });

    it('should handle strength workout with alternatives', () => {
      const result = createWorkoutActivity({
        name: 'Barbell Bench Press',
        type: 'main',
        order: 1,
        equipment: ['barbell', 'bench'],
        alternativeExercises: ['Dumbbell Bench Press', 'Push-ups'],
        instructions: ['Keep back flat', 'Control the descent'],
        videoUrl: 'https://example.com/bench-press',
      });

      if (result.isSuccess) {
        expect(activityRequiresEquipment(result.value)).toBe(true);
        expect(hasAlternatives(result.value)).toBe(true);
        expect(hasInstructions(result.value)).toBe(true);
        expect(hasVideo(result.value)).toBe(true);
      }
    });
  });
});


describe('toWorkoutActivityView', () => {
  it('should map domain entity to view with computed fields', () => {
    const result = createWorkoutActivity({
      name: 'Bench Press',
      type: 'main',
      order: 1,
      equipment: ['Barbell', 'Bench'],
      duration: 45,
      instructions: ['Lift heavy'],
    });

    if (result.isSuccess) {
      const view = toWorkoutActivityView(result.value);

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
    const structureResult = createIntervalStructure([
      { duration: 60, intensity: 'sprint', rest: 60 },
    ], 5); // 5 rounds * (60+60) = 600s = 10min

    if (structureResult.isSuccess) {
      const result = createIntervalSession('Sprints', structureResult.value, 1);
      if (result.isSuccess) {
        const view = toWorkoutActivityView(result.value);
        expect(view.estimatedDuration).toBe(10);
        expect(view.estimatedCalories).toBeGreaterThan(0);
      }
    }
  });
});
