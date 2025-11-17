import { Result, UseCase } from '@bene/core/shared';
import { IAuthService, RequestContext } from '../../ports/auth.service';

// Define the user interface for the session
export interface SessionUser {
  id: string;
  email: string;
  name?: string;
}

// Output interface for the session
export interface GetCurrentSessionOutput {
  user: SessionUser | null;
  isAuthenticated: boolean;
  expiresAt?: Date;
}

export class GetCurrentSessionUseCase
  implements UseCase<RequestContext, GetCurrentSessionOutput>
{
  constructor(private authService: IAuthService) {}

  async execute(
    requestContext: RequestContext,
  ): Promise<Result<GetCurrentSessionOutput>> {
    // Call the infrastructure layer to check session
    const sessionResult = await this.authService.getSession(requestContext);

    if (sessionResult.isSuccess && sessionResult.value) {
      // If session is valid, get the current user
      const userResult = await this.authService.getCurrentUser(requestContext);

      if (userResult.isSuccess) {
        const user = userResult.value;
        return Result.ok({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          isAuthenticated: true,
        });
      } else {
        return Result.ok({
          user: null,
          isAuthenticated: false,
        });
      }
    } else {
      return Result.ok({
        user: null,
        isAuthenticated: false,
      });
    }
  }
}
