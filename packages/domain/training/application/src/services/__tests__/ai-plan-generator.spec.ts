
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/shared';
import { AIPlanGenerator, GeneratePlanInput } from '../ai-plan-generator.js';
import { AIProvider, AICompletionRequest } from '@bene/shared';

// Mock Provider
const mockProvider = {
  complete: vi.fn(),
} as unknown as AIProvider;

describe('AIPlanGenerator', () => {
  let generator: AIPlanGenerator;

  beforeEach(() => {
    vi.clearAllMocks();
    generator = new AIPlanGenerator(mockProvider);
  });

  it('should correctly parse AI JSON response into FitnessPlan', async () => {
    // Arrange
    const input: GeneratePlanInput = {
      userId: 'user-123',
      goals: { primary: 'strength_hypertrophy', secondary: [], targetMetrics: {} },
      constraints: {
        availableDays: [1, 3, 5],
        availableEquipment: ['dumbbell'],
        location: 'home',
        maxDuration: 45,
        injuries: [],
      },
      experienceLevel: 'intermediate',
    };

    const mockAiResponse = {
      name: 'Home Strength Builder',
      weeks: [
        {
          weekNumber: 1,
          workouts: [
            {
              dayOfWeek: 1,
              type: 'Upper Body',
              activities: [
                {
                  activityType: 'warmup',
                  instructions: 'Arm circles',
                  structure: { type: 'exercises', exercises: [] }
                },
                {
                  activityType: 'main',
                  instructions: 'Dumbbell Press 3x10',
                  structure: { type: 'exercises', exercises: [] }
                }
              ]
            }
          ]
        }
      ]
    };

    mockProvider.complete = vi.fn().mockResolvedValue(
      Result.ok({
        content: JSON.stringify(mockAiResponse),
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      })
    );

    // Act
    const result = await generator.generatePlan(input);

    // Assert
    expect(result.isSuccess).toBe(true);
    const plan = result.value;

    expect(plan.title).toBe('Home Strength Builder');
    expect(plan.weeks).toHaveLength(1);
    expect(plan.weeks[0].weekNumber).toBe(1);
    expect(plan.weeks[0].workouts).toHaveLength(1);
    expect(plan.weeks[0].workouts[0].type).toBe('Upper Body');
    // Verify activities mapped
    expect(plan.weeks[0].workouts[0].activities).toHaveLength(2);
    expect(plan.weeks[0].workouts[0].activities[1].instructions).toBe('Dumbbell Press 3x10');
  });

  it('should handle invalid JSON from AI', async () => {
    const input: GeneratePlanInput = {
      userId: 'user-123',
      goals: { primary: 'strength', secondary: [], targetMetrics: {} },
      constraints: { availableDays: [], availableEquipment: [], location: 'gym', maxDuration: 60, injuries: [] },
      experienceLevel: 'beginner'
    };

    mockProvider.complete = vi.fn().mockResolvedValue(
      Result.ok({
        content: 'Not a JSON string',
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      })
    );

    const result = await generator.generatePlan(input);
    expect(result.isFailure).toBe(true);
    expect(result.error?.message).toContain('Failed to parse plan data');
  });
});
