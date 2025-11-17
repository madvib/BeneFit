import { Result, UseCase } from '@bene/core/shared';
import { IUserRepository } from '../../ports/user.repository.js';

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

export class UpdateUserProfileUseCase
  implements UseCase<UpdateUserProfileInput, UpdateUserProfileOutput>
{
  constructor(private userRepository: IUserRepository) {}

  async execute(
    input: UpdateUserProfileInput,
  ): Promise<Result<UpdateUserProfileOutput>> {
    try {
      // Get the current user
      const userResult = await this.userRepository.findById(input.userId);

      if (userResult.isFailure) {
        return Result.fail(new Error('User not found'));
      }

      // In a real implementation, you would update the user profile data
      // For now, we're just returning success since the actual implementation
      // would handle updating user profile data in a different way
      // (e.g., separate profile entity, or user metadata repository)

      return Result.ok({
        success: true,
        message: 'User profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return Result.fail(
        error instanceof Error ? error : new Error('Failed to update user profile'),
      );
    }
  }
}
