import { Result, UseCase } from '@bene/core/shared';
import { IAuthRepository } from '../../ports/auth.repository.js';

// Define the profile goal interface
interface ProfileGoal {
  id: string;
  text: string;
  completed: boolean;
}

// Define the fitness statistics interface
interface FitnessStats {
  totalWorkouts: number;
  currentStreak: number;
  totalAchievements: number;
  totalDistance: number; // in km
  totalCalories: number;
  averageHeartRate: number; // in bpm
  lastWorkoutDate: Date;
}

// Enhanced output interface
export interface GetUserProfileOutput {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio: string;
  profilePicture: string;
  fitnessStats: FitnessStats;
  goals: ProfileGoal[];
  aboutMe: string;
  createdAt: Date;
  isActive: boolean;
}

export class GetUserProfileUseCase implements UseCase<string, GetUserProfileOutput> {
  constructor(
    private authRepository: IAuthRepository,
  ) {}

  async execute(userId: string): Promise<Result<GetUserProfileOutput>> {
    try {
      // Get the user from repository
      const userResult = await this.authRepository.findById(userId);

      if (userResult.isFailure) {
        return Result.fail(new Error('User not found'));
      }

      const user = userResult.value;

      // Get user's workout history to calculate fitness stats
      // In a real implementation, we'd get this from a specific user's workout data
      // For now, we'll use mock data
      // const workouts = await this.workoutRepository.getWorkoutHistory();

      // Calculate fitness statistics based on workout data
      const fitnessStats: FitnessStats = {
        totalWorkouts: 24, // This would be calculated from actual workout data
        currentStreak: 42, // This would be calculated from actual workout data
        totalAchievements: 12, // This would come from achievements data
        totalDistance: 245, // This would be calculated from workout data
        totalCalories: 12800, // This would be calculated from workout data
        averageHeartRate: 145, // This would be calculated from workout data
        lastWorkoutDate: new Date(), // This would come from most recent workout
      };

      // Define goals - in a real implementation this would come from a goals repository
      const goals: ProfileGoal[] = [
        { id: '1', text: 'Run a marathon', completed: true },
        { id: '2', text: 'Lose 10kg', completed: true },
        { id: '3', text: 'Build 20lbs muscle', completed: false },
      ];

      // Extract first name and last name from the name field if it exists
      let firstName: string | undefined;
      let lastName: string | undefined;

      if (user.name) {
        const nameParts = user.name.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;
      }

      return Result.ok({
        id: user.id,
        email: user.email,
        name: user.name,
        firstName,
        lastName,
        phone: undefined, // In a real implementation, phone would be part of the user object
        bio: 'Fitness Enthusiast',
        profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
        fitnessStats,
        goals,
        aboutMe:
          'Fitness enthusiast who loves running, weight training, and maintaining a healthy lifestyle. Always looking to improve and reach new goals!',
        createdAt: user.createdAt,
        isActive: user.isActive,
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      return Result.fail(
        error instanceof Error ? error : new Error('Failed to get user profile'),
      );
    }
  }
}
