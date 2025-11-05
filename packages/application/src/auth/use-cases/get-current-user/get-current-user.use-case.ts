import { Result, UseCase } from '@bene/core/shared';

// Output interface
export interface GetCurrentUserOutput {
  id: string;
  email: string;
  name?: string;
}

export class GetCurrentUserUseCase implements UseCase<void, GetCurrentUserOutput> {
  async execute(): Promise<Result<GetCurrentUserOutput>> {
    try {
      // In a real implementation, this would get the user from the session context
      // For now, I'll return mock data as this would normally get user from request context
      // The actual session management would happen outside of the application layer
      // and the user ID would be provided to use cases through other means
      
      // This is a placeholder since we need to handle session management differently
      // Real implementation would get user ID from session/auth context
      return Result.fail(new Error('Session management needs to be handled in infrastructure layer'));
    } catch (error) {
      console.error('Error getting current user:', error);
      return Result.fail(error instanceof Error ? error : new Error('Failed to get current user'));
    }
  }
}