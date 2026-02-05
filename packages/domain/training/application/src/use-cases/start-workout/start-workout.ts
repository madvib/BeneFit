import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import {
  CreateWorkoutSessionSchema,
  WorkoutSessionCommands,
  CreateWorkoutActivitySchema,
  toWorkoutSessionView,
} from '@bene/training-core';
import type { WorkoutSessionView } from '@bene/training-core';
import type { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import { WorkoutStartedEvent } from '../../events/workout-started.event.js';


// Single request schema with ALL fields
export const StartWorkoutRequestSchema = z.object({
  // Server context
  userId: z.uuid(),

  // Client data
  userName: z.string().min(1),
  userAvatar: z.string().optional(),
  fromPlan: z.boolean().optional(),
  // type should be domain derived
  workoutType: z.string().optional(),
  activities: z.array(CreateWorkoutActivitySchema).optional(),
  isMultiplayer: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

// Zod inferred type with original name
export type StartWorkoutRequest = z.infer<typeof StartWorkoutRequestSchema>;



// Zod schema for response validation
export interface StartWorkoutResponse {
  session: WorkoutSessionView;
}

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
    // 2. Validate custom workout request
    if (!request.workoutType || !request.activities || request.activities.length === 0) {
      return Result.fail(
        new Error('Must provide workoutType and activities for custom workout'),
      );
    }

    // 3. Create session using canonical API
    const sessionParseResult = CreateWorkoutSessionSchema.safeParse({
      ownerId: request.userId,
      workoutType: request.workoutType,
      activities: request.activities,
      planId: undefined,
      workoutTemplateId: undefined,
      isMultiplayer: request.isMultiplayer,
      configuration: request.isPublic !== undefined ? { isPublic: request.isPublic } : undefined,
    });

    if (!sessionParseResult.success) {
      return Result.fail(new Error(`Failed to create session: ${ sessionParseResult.error.message }`));
    }

    // 4. Start session
    const startedSessionResult = WorkoutSessionCommands.startSession(
      sessionParseResult.data,
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
    return Result.ok({
      session: toWorkoutSessionView(session),
    });
  }
}
