'use server';

import { accountUseCases } from '@/providers/account-use-cases';
import { getCurrentUser } from '@/controllers/auth';

// Define the profile goal interface
export interface ProfileGoal {
  id: string;
  text: string;
  completed: boolean;
}

// Define the fitness statistics interface
export interface FitnessStats {
  totalWorkouts: number;
  currentStreak: number;
  totalAchievements: number;
  totalDistance: number; // in km
  totalCalories: number;
  averageHeartRate: number; // in bpm
  lastWorkoutDate: string; // ISO string format
}

// Define the return types for enhanced user profile data
export interface UserProfileData {
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
}

interface GetUserProfileResult {
  success: boolean;
  data?: UserProfileData;
  error?: string;
}

export async function getUserProfile(): Promise<GetUserProfileResult> {
  try {
    // Get user ID from session context
    const userResult = await getCurrentUser();

    if (!userResult.success || !userResult.data) {
      console.error('Failed to get current user:', userResult.error);
      return {
        success: false,
        error: userResult.error || 'User not authenticated',
      };
    }

    const userId = userResult.data.id;

    // Use the use case to get user profile
    const result = await accountUseCases
      .getUserProfileUseCase()
      .then((uc) => uc.execute(userId));

    if (result.isSuccess) {
      // Transform the result to match the UI requirements
      const profile = result.value;
      const nameParts = profile.name?.split(' ') || [];
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

      return {
        success: true,
        data: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          firstName,
          lastName,
          phone: profile.phone,
          bio: profile.bio,
          profilePicture: profile.profilePicture,
          fitnessStats: {
            ...profile.fitnessStats,
            lastWorkoutDate: profile.fitnessStats.lastWorkoutDate.toISOString(), // Convert to string for client
          },
          goals: profile.goals,
          aboutMe: profile.aboutMe,
        },
      };
    } else {
      console.error('Use case failed:', result.error);
      return {
        success: false,
        error: result.error?.message || 'Failed to fetch user profile',
      };
    }
  } catch (error) {
    console.error('Error in getUserProfile controller:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  aboutMe?: string;
  profilePicture?: string;
}

interface UpdateUserProfileResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function updateUserProfile(
  input: UpdateUserProfileInput,
): Promise<UpdateUserProfileResult> {
  try {
    // Get user ID from session context
    const userResult = await getCurrentUser();

    if (!userResult.success || !userResult.data) {
      console.error('Failed to get current user:', userResult.error);
      return {
        success: false,
        error: userResult.error || 'User not authenticated',
      };
    }

    const userId = userResult.data.id;

    // Use the use case to update user profile
    const result = await accountUseCases.updateUserProfileUseCase().then((uc) =>
      uc.execute({
        userId: userId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        bio: input.bio,
        aboutMe: input.aboutMe,
        profilePicture: input.profilePicture,
      }),
    );

    if (result.isSuccess) {
      return {
        success: true,
        message: result.value.message,
      };
    } else {
      console.error('Use case failed:', result.error);
      return {
        success: false,
        error: result.error?.message || 'Failed to update user profile',
      };
    }
  } catch (error) {
    console.error('Error in updateUserProfile controller:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
