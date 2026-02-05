import { Result, mapZodError } from '@bene/shared';
import { WorkoutPreview, WorkoutPreviewSchema } from './workout-preview.types.js';

/**
 * FACTORY: Creates a validated WorkoutPreview Value Object.
 */
export function createWorkoutPreview(props: unknown): Result<WorkoutPreview> {
  const parseResult = WorkoutPreviewSchema.safeParse(props);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }
  return Result.ok(parseResult.data);
}
