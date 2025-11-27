import { Result, UseCase } from '@bene/core/shared';
import { createWorkoutSession, WorkoutSessionCommands } from '@bene/core/workouts';
import { WorkoutPlanQueries, WorkoutTemplateCommands } from '@bene/core/plans';
import type { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import type { WorkoutPlanRepository } from '../../../planning/repositories/workout-plan-repository.js';
import type { UserProfileRepository } from '../../../profile/repositories/user-profile-repository.js';
import type { EventBus } from '../../../shared/event-bus.js';

export interface StartWorkoutRequest {
  userId: string;
  userName: string;
  userAvatar?: string;

  // Option 1: From active plan
  fromPlan?: boolean;

  // Option 2: Custom workout
  workoutType?: string;
  activities?: unknown[]; // WorkoutActivity[]

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
    instructions: string;
  };
}

export class StartWorkoutUseCase
  implements UseCase<StartWorkoutRequest, StartWorkoutResponse>
{
  constructor(
    private sessionRepository: WorkoutSessionRepository,
    private planRepository: WorkoutPlanRepository,
    private profileRepository: UserProfileRepository,
    private eventBus: EventBus,
  ) {}

  async execute(request: StartWorkoutRequest): Promise<Result<StartWorkoutResponse>> {
    let workoutType: string;
    let activities: any[];
    let planId: string | undefined;
    let workoutTemplateId: string | undefined;

    // 1. Determine workout source
    if (request.fromPlan) {
      // Get from active plan
      const planResult = await this.planRepository.findActiveByUserId(request.userId);
      if (planResult.isFailure) {
        return Result.fail(new Error('No active plan found'));
      }

      const plan = planResult.value;
      const todaysWorkout = WorkoutPlanQueries.getCurrentWorkout(plan);

      if (!todaysWorkout) {
        return Result.fail(new Error('No workout scheduled for today'));
      }

      if (todaysWorkout.status === 'completed') {
        return Result.fail(new Error("Today's workout already completed"));
      }

      if (todaysWorkout.status === 'in_progress') {
        return Result.fail(new Error('Workout already in progress'));
      }

      workoutType = todaysWorkout.type;
      activities = todaysWorkout.activities;
      planId = plan.id;
      workoutTemplateId = todaysWorkout.id;

      // Mark workout as started in plan
      const startedWorkoutResult = WorkoutTemplateCommands.startWorkout(todaysWorkout);
      if (startedWorkoutResult.isFailure) {
        return Result.fail(startedWorkoutResult.error);
      }
      // Note: We would need to update the plan with the started workout
      // This requires updating the week's workouts array
      // For now, we'll skip this step as it requires more complex plan manipulation
    } else {
      // Custom workout
      if (!request.workoutType || !request.activities) {
        return Result.fail(
          new Error('Must provide workoutType and activities for custom workout'),
        );
      }
      workoutType = request.workoutType;
      activities = request.activities;
    }

    // 2. Create session
    const sessionResult = createWorkoutSession({
      ownerId: request.userId,
      workoutType,
      activities,
      planId,
      workoutTemplateId,
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
      estimatedDurationMinutes: session.activities.reduce(
        (sum, a) =>
          sum +
          (a.structure.type === 'intervals'
            ? Math.ceil(
                (a.structure.totalIntervals * a.structure.intervalDurationSeconds) / 60,
              )
            : 30),
        0,
      ),
      currentActivity: {
        type: firstActivity.activityType,
        instructions: firstActivity.instructions,
      },
    });
  }
}
