import { Result, UseCase } from '@bene/shared-domain';
import {
  createWorkoutSession,
  WorkoutActivity,
  WorkoutSessionCommands,
} from '@bene/training-core';
import type { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import type { EventBus } from '@bene/shared-domain';

export interface StartWorkoutRequest {
  userId: string;
  userName: string;
  userAvatar?: string;

  // Option 1: From active plan
  fromPlan?: boolean;

  // Option 2: Custom workout
  workoutType?: string;
  activities?: WorkoutActivity[];

  // Multiplayer options
  isMultiplayer?: boolean;
  isPublic?: boolean;
}

export interface StartWorkoutResponse {
  sessionId: string;
  workoutType: string;
  totalActivities: number;
  estimatedDurationMinutes: number;
  currentActivity: {
    type: string;
    instructions: string[];
  };
}

export class StartWorkoutUseCase
  implements UseCase<StartWorkoutRequest, StartWorkoutResponse>
{
  constructor(
    private sessionRepository: WorkoutSessionRepository,
    // private planRepository: WorkoutPlanRepository,
    private eventBus: EventBus,
  ) {}

  async execute(request: StartWorkoutRequest): Promise<Result<StartWorkoutResponse>> {
    // 1. Validate custom workout request
    if (!request.workoutType || !request.activities) {
      return Result.fail(
        new Error('Must provide workoutType and activities for custom workout'),
      );
    }

    // 2. Create session
    const sessionResult = createWorkoutSession({
      ownerId: request.userId,
      workoutType: request.workoutType,
      activities: request.activities || [],
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
    await this.eventBus.publish({
      type: 'WorkoutStarted',
      userId: request.userId,
      sessionId: session.id,
      planId: session.planId,
      timestamp: new Date(),
    });

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
