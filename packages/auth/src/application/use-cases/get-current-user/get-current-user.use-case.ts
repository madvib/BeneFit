import { Result, UseCase } from '@bene/shared-domain';
import { IAuthService, RequestContext } from '../../ports/auth.service.js';

// Output interface
export interface GetCurrentUserOutput {
  id: string;
  email: string;
  name?: string;
}

export class GetCurrentUserUseCase
  implements UseCase<RequestContext, GetCurrentUserOutput>
{
  constructor(private authService: IAuthService) {}

  async execute(requestContext: RequestContext): Promise<Result<GetCurrentUserOutput>> {
    try {
      // Use provided context or create a default one
      const context = requestContext || {
        headers: new Headers(), // In a real app, you'd pass the actual request headers
        cookies: {}, // In a real app, you'd pass the actual cookies
      };

      // Call the infrastructure layer to get current user
      const result = await this.authService.getCurrentUser(context);

      if (result.isSuccess) {
        const user = result.value;
        return Result.ok({
          id: user.id,
          email: user.email,
          name: user.name,
        });
      } else {
        return Result.fail(result.error || new Error('Failed to get current user'));
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return Result.fail(
        error instanceof Error ? error : new Error('Failed to get current user'),
      );
    }
  }
}
