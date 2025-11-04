import { Result } from '@bene/core/shared';
import { IAuthRepository } from '../../ports/auth.repository.js';

export interface SignOutInput {}

export interface SignOutOutput {}

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
  constructor(private authRepository: IAuthRepository) {}

  async execute(input?: SignOutInput): Promise<Result<SignOutOutput>> {
    // Execute sign out via repository
    const signOutResult = await this.authRepository.signOut();

    if (signOutResult.isSuccess) {
      return Result.ok({});
    }
    
    return signOutResult as Result<SignOutOutput>;
  }
}
