import { Result } from '@bene/core/shared';
import { IAuthService, RequestContext } from '../../ports/auth.service.js';

/**
 * Signs out the currently authenticated user.
 *
 * @example
 * const useCase = new SignOutUseCase(authRepository);
 * const result = await useCase.execute();
 * if (result.isSuccess) {
 *   console.log('User signed out successfully');
 * }
 */
export class SignOutUseCase {
  constructor(private authService: IAuthService) {}

  async execute(requestContext: RequestContext): Promise<Result<void>> {
    // Execute sign out via repository
    const signOutResult = await this.authService.signOut(requestContext);

    if (signOutResult.isSuccess) {
      return Result.ok();
    }
    // If the auth repository signOut returns void but we need SignOutOutput,
    // we need to handle the error case properly
    return Result.fail(signOutResult.error);
  }
}
