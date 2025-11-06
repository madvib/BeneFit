import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { GetActivityFeedUseCase } from './get-activity-feed.use-case';
import { WorkoutRepository } from '../../ports/repository/activities.repository.js';
import { ActivityFeedFetchError } from '../../errors/index.js';

// Create a mock repository interface
type MockWorkoutRepository = Mocked<WorkoutRepository>;

describe('GetActivityFeedUseCase', () => {
  let useCase: GetActivityFeedUseCase;
  let mockActivityRepository: MockWorkoutRepository;

  beforeEach(() => {
    mockActivityRepository = {
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

    useCase = new GetActivityFeedUseCase(mockActivityRepository);
  });

  describe('execute', () => {
    it('should return activity feed when repository call succeeds', async () => {
      // Arrange
      const mockFeed = [
        { id: '1', title: 'Workout completed', date: new Date() },
        { id: '2', title: 'Goal reached', date: new Date() }
      ];
      mockActivityRepository.getActivityFeed.mockResolvedValue(mockFeed);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value).toEqual(mockFeed);
      }
      expect(mockActivityRepository.getActivityFeed).toHaveBeenCalled();
    });

    it('should return failure with ActivityFeedFetchError when repository call fails', async () => {
      // Arrange
      mockActivityRepository.getActivityFeed.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(ActivityFeedFetchError);
        expect(result.error.message).toBe('Failed to fetch activity feed. Please try again later.');
      }
    });

    it('should handle repository returning empty feed', async () => {
      // Arrange
      const mockFeed: Array<{id: string, title: string, date: Date}> = [];
      mockActivityRepository.getActivityFeed.mockResolvedValue(mockFeed);

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