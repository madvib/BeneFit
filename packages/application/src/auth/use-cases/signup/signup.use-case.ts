import { Result } from '@bene/core/shared';
import { isValidEmail } from '@bene/utils/validate';
import { AuthError, WeakPasswordError } from '../../errors/index.js';
import { IAuthRepository } from '../../ports/auth.repository.js';

export interface SignupInput {
  email: string;
  password: string;
}

export interface SignupOutput {
  userId: string;
  email: string;
}

/**
 * Registers a new user with email and password.
 * Returns user information on success.
 *
 * @example
 * const useCase = new SignupUseCase(authRepository);
 * const result = await useCase.execute({ email: 'user@example.com', password: 'password' });
 * if (result.isSuccess) {
 *   console.log(result.value);
 * }
 */
export class SignupUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: SignupInput): Promise<Result<SignupOutput>> {
    // 1. Validate input
    const validationResult = this.validateInput(input);
    if (validationResult.isFailure) {
      return Result.fail(validationResult.error);
    }

    // 2. Execute signup via repository
    const signupResult = await this.authRepository.signup(input);

    return signupResult;
  }

  private validateInput(input: SignupInput): Result<void> {
    if (!input.email || !input.password) {
      return Result.fail(new AuthError('Email and password are required'));
    }

    if (!isValidEmail(input.email)) {
      return Result.fail(new AuthError('Invalid email format'));
    }

    if (input.password.length < 6) {
      return Result.fail(new WeakPasswordError());
    }

    return Result.ok();
  }
}
