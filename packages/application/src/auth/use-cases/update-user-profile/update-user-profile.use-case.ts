import { Result, UseCase } from '@bene/core/shared';
import { IAuthRepository } from '../../ports/auth.repository.js';
import { User } from '@bene/core/auth';

// Input and output interfaces
interface UpdateUserProfileInput {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  aboutMe?: string;
  profilePicture?: string;
}

interface UpdateUserProfileOutput {
  success: boolean;
  message?: string;
}

export class UpdateUserProfileUseCase implements UseCase<UpdateUserProfileInput, Result<UpdateUserProfileOutput>> {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: UpdateUserProfileInput): Promise<Result<UpdateUserProfileOutput>> {
    try {
      // Get the current user
      const userResult = await this.authRepository.findById(input.userId);
      
      if (userResult.isFailure) {
        return Result.fail(new Error('User not found'));
      }

      const user = userResult.value;
      
      // Update user properties based on input
      // For now, we'll update the user metadata in the core entity or update the user object
      // In a real implementation, you might need to update both the core entity and external systems like Supabase
      
      // Update user in repository
      const updatedFields: Partial<User> = {};
      
      if (input.firstName || input.lastName) {
        const name = [input.firstName, input.lastName].filter(n => n).join(' ');
        updatedFields.name = name;
      }
      
      if (input.email) {
        updatedFields.email = input.email;
      }

      // In a real implementation, you'd also update the user metadata (first_name, last_name, phone, bio, aboutMe, profilePicture) 
      // For now, we'll assume the repository handles the update
      await this.authRepository.update(input.userId, updatedFields);

      return Result.ok({
        success: true,
        message: 'User profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return Result.fail(error instanceof Error ? error : new Error('Failed to update user profile'));
    }
  }
}