import { WorkoutRepository } from '@bene/application/activities';
import { Workout } from '@bene/core/activities';
import { Result } from '@bene/core/shared';

// Mock repository for Workout domain entity
export class MockWorkoutRepository implements WorkoutRepository {
  async findById(id: string): Promise<Result<Workout>> {
    const workouts = await this.getWorkoutHistory();
    const workout = workouts.find((w) => w.id === id);

    if (!workout) {
      return Result.fail(new Error('Workout not found'));
    }

    return Result.ok(workout);
  }

  async save(entity: Workout): Promise<Result<void>> {
    // In a mock implementation, we just return success
    console.log(`${entity} saved`);

    return Result.ok();
  }

  async delete(id: string): Promise<Result<void>> {
    // In a mock implementation, we just return success
    console.log(`${id} deleted`);
    return Result.ok();
  }
  async getActivityFeed(): Promise<Workout[]> {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
    const data = await import('../data/mock/activityFeed.json');
    const dtoData = data.default as Array<{
      id: number;
      date: string;
      type: string;
      duration: string;
      distance: string | null;
      sets: number | null;
      laps: number | null;
      calories: number;
      isActive: boolean;
    }>;

    const workouts: Workout[] = [];
    for (const dto of dtoData) {
      const entityResult = Workout.create({
        id: dto.id.toString(),
        date: dto.date,
        type: dto.type,
        duration: dto.duration,
        calories: dto.calories,
        distance: dto.distance !== null ? dto.distance : undefined,
        sets: dto.sets !== null ? dto.sets : undefined,
        laps: dto.laps !== null ? dto.laps : undefined,
        isActive: dto.isActive,
      });

      if (entityResult.isSuccess) {
        workouts.push(entityResult.value);
      } else {
        console.error('Failed to create Workout entity:', entityResult.error);
      }
    }

    return workouts;
  }
  async getWorkoutHistory(): Promise<Workout[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = await import('../data/mock/workoutHistory.json');
    const dtoData = data.default as {
      id: number;
      date: string;
      type: string;
      duration: string;
      distance?: string;
      sets?: number;
      laps?: number;
      calories: number;
    }[];

    const workouts: Workout[] = [];
    for (const dto of dtoData) {
      const entityResult = Workout.create({
        date: dto.date,
        type: dto.type,
        duration: dto.duration,
        calories: dto.calories,
        distance: dto.distance !== null ? dto.distance : undefined,
        sets: dto.sets !== null ? dto.sets : undefined,
        laps: dto.laps !== null ? dto.laps : undefined,
        id: dto.id.toString(),
        isActive: false,
      });

      if (entityResult.isSuccess) {
        workouts.push(entityResult.value);
      }
    }

    return workouts;
  }
}
