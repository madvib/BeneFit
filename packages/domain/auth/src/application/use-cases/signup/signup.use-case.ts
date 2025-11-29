import { EmailAddress, Password, Result } from '@bene/domain-shared';
import { AuthError } from '../../errors/index.js';
import { IAuthService } from '../../ports/auth.service.js';

export interface SignupInput {
  name: string;
  email: EmailAddress;
  password: Password;
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
  constructor(private authService: IAuthService) {}

  async execute(input: SignupInput): Promise<Result<void>> {
    // 1. Validate input
    const validationResult = this.validateInput(input);
    if (validationResult.isFailure) {
      return Result.fail(validationResult.error);
    }

    // 2. Execute signup via repository
    const signupResult = await this.authService.signup(input);

    return signupResult;
  }

  private validateInput(input: SignupInput): Result<void> {
    if (!input.email || !input.password) {
      return Result.fail(new AuthError('Email and password are required'));
    }

    return Result.ok();
  }
}
