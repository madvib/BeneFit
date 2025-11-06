import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { GetWorkoutHistoryUseCase } from './get-workout-history.use-case';
import { WorkoutRepository } from '../../ports/repository/activities.repository.js';
import { WorkoutHistoryFetchError } from '../../errors/index.js';

// Create a mock repository interface
type MockWorkoutRepository = Mocked<WorkoutRepository>;

describe('GetWorkoutHistoryUseCase', () => {
  let useCase: GetWorkoutHistoryUseCase;
  let mockWorkoutRepository: MockWorkoutRepository;

  beforeEach(() => {
    mockWorkoutRepository = {
      getActivityFeed: vi.fn(),
      getWorkoutHistory: vi.fn(),
      deleteWorkout: vi.fn(),
      getWorkoutsByUserId: vi.fn(),
      getWorkoutById: vi.fn(),
      createWorkout: vi.fn(),
      updateWorkout: vi.fn(),
      getWorkoutsByPlanId: vi.fn(),
      getWorkoutByDate: vi.fn(),
    } as unknown as MockWorkoutRepository;

    useCase = new GetWorkoutHistoryUseCase(mockWorkoutRepository);
  });

  describe('execute', () => {
    it('should return workout history when repository call succeeds', async () => {
      // Arrange
      const mockWorkouts = [
        { id: '1', name: 'Morning Run', date: new Date() },
        { id: '2', name: 'Evening Workout', date: new Date() }
      ];
      mockWorkoutRepository.getWorkoutHistory.mockResolvedValue(mockWorkouts);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value).toEqual(mockWorkouts);
      }
      expect(mockWorkoutRepository.getWorkoutHistory).toHaveBeenCalled();
    });

    it('should return failure with WorkoutHistoryFetchError when repository call fails', async () => {
      // Arrange
      mockWorkoutRepository.getWorkoutHistory.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(WorkoutHistoryFetchError);
        expect(result.error.message).toBe('Failed to fetch workout history. Please try again later.');
      }
    });

    it('should handle repository returning empty workout history', async () => {
      // Arrange
      const mockWorkouts: Array<{id: string, name: string, date: Date}> = [];
      mockWorkoutRepository.getWorkoutHistory.mockResolvedValue(mockWorkouts);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value).toEqual([]);
      }
    });
  });
});