import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import {
  createWorkoutSession,
  WorkoutActivity,
  WorkoutSessionCommands,
  createWorkoutActivity,
} from '@bene/training-core';
import type { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import { WorkoutStartedEvent } from '../../events/workout-started.event.js';

// Simplified schema for WorkoutActivity - we'll use unknown for now and convert at runtime
export const WorkoutActivitySchema = z
  .object({
    name: z.string().min(1),
    type: z.enum(['warmup', 'main', 'cooldown', 'interval', 'circuit']),
    order: z.number().int().nonnegative(),
    structure: z.unknown().optional(),
    instructions: z.array(z.string()).optional(),
    distance: z.number().nonnegative().optional(),
    duration: z.number().nonnegative().optional(),
    pace: z.string().optional(),
    videoUrl: z.string().url().optional(),
    equipment: z.array(z.string()).optional(),
    alternativeExercises: z.array(z.string()).optional(),
  })
  .readonly();



// Single request schema with ALL fields
export const StartWorkoutRequestSchema = z.object({
  // Server context
  userId: z.string().min(1), // Should ideally be UUID but min(1) is safer for legacy mocks

  // Client data
  userName: z.string().min(1),
  userAvatar: z.string().optional(),
  fromPlan: z.boolean().optional(),
  workoutType: z.string().optional(),
  activities: z.array(WorkoutActivitySchema).optional(),
  isMultiplayer: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

// Zod inferred type with original name
export type StartWorkoutRequest = z.infer<typeof StartWorkoutRequestSchema>;



// Zod schema for response validation
export const StartWorkoutResponseSchema = z.object({
  sessionId: z.string(),
  workoutType: z.string(),
  totalActivities: z.number(),
  estimatedDurationMinutes: z.number(),
  currentActivity: z.object({
    type: z.string(),
    instructions: z.array(z.string()),
  }),
});

// Zod inferred type with original name
export type StartWorkoutResponse = z.infer<typeof StartWorkoutResponseSchema>;

export class StartWorkoutUseCase extends BaseUseCase<
  StartWorkoutRequest,
  StartWorkoutResponse
> {
  constructor(
    private sessionRepository: WorkoutSessionRepository,
    // private planRepository: FitnessPlanRepository,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(request: StartWorkoutRequest): Promise<Result<StartWorkoutResponse>> {
    // 1. Validate custom workout request
    if (!request.workoutType || !request.activities) {
      return Result.fail(
        new Error('Must provide workoutType and activities for custom workout'),
      );
    }

    // 2. Convert schema activities to domain activities
    const domainActivities = request.activities.map((activity) => {
      const activityResult = createWorkoutActivity({
        name: activity.name,
        type: activity.type,
        order: activity.order,
        structure: undefined, // We'll handle structure conversion separately if needed
        instructions: activity.instructions,
        distance: activity.distance,
        duration: activity.duration,
        pace: activity.pace,
        videoUrl: activity.videoUrl,
        equipment: activity.equipment,
        alternativeExercises: activity.alternativeExercises,
      });

      if (activityResult.isFailure) {
        throw new Error(`Failed to create workout activity: ${ activityResult.error }`);
      }

      return activityResult.value;
    });

    // 2. Create session
    const sessionResult = createWorkoutSession({
      ownerId: request.userId,
      workoutType: request.workoutType,
      activities: domainActivities,
      planId: undefined,
      workoutTemplateId: undefined,
      isMultiplayer: request.isMultiplayer,
      configuration: {
        isPublic: request.isPublic,
      },
    });

    if (sessionResult.isFailure) {
      return Result.fail(sessionResult.error);
    }

    // 3. Start session
    const startedSessionResult = WorkoutSessionCommands.startSession(
      sessionResult.value,
      request.userName,
      request.userAvatar,
    );

    if (startedSessionResult.isFailure) {
      return Result.fail(startedSessionResult.error);
    }

    const session = startedSessionResult.value;

    // 4. Save to DO
    await this.sessionRepository.save(session);

    // 5. Emit event
    await this.eventBus.publish(
      new WorkoutStartedEvent({
        userId: request.userId,
        sessionId: session.id,
        planId: session.planId,
      }),
    );

    // 6. Return session details
    const firstActivity = session.activities[0];

    return Result.ok({
      sessionId: session.id,
      workoutType: session.workoutType,
      totalActivities: session.activities.length,
      estimatedDurationMinutes: session.activities.reduce((sum, a) => {
        // Use duration if available, otherwise estimate based on structure
        if (a.duration) return sum + a.duration;
        if (!a.structure) return sum + 30;

        // Calculate based on intervals if present
        if (a.structure.intervals && a.structure.intervals.length > 0) {
          const totalIntervalTime = a.structure.intervals.reduce(
            (total, interval) => total + interval.duration + interval.rest,
            0,
          );
          const rounds = a.structure.rounds || 1;
          return sum + Math.ceil((totalIntervalTime * rounds) / 60);
        }

        return sum + 30; // Default fallback
      }, 0),
      currentActivity: {
        type: firstActivity ? firstActivity.type : 'warmup',
        instructions:
          firstActivity && firstActivity.instructions
            ? [...firstActivity.instructions]
            : [],
      },
    });
  }
}
