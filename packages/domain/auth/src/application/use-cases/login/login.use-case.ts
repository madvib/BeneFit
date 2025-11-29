import { EmailAddress, Password, Result } from '@bene/domain-shared';
import { IAuthService } from '../../ports/auth.service.js';
import { AuthError } from '../../errors/index.js';

export interface LoginInput {
  email: EmailAddress;
  password: Password;
  next?: string;
}

export interface LoginOutput {
  userId: string;
  email: string;
}

/**
 * Authenticates a user with email and password.
 * Returns user information on success.
 *
 * @example
 * const useCase = new LoginUseCase(authRepository);
 * const result = await useCase.execute({ email: 'user@example.com', password: 'password' });
 * if (result.isSuccess) {
 *   console.log(result.value);
 * }
 */
export class LoginUseCase {
  constructor(private authService: IAuthService) {}

  async execute(input: LoginInput): Promise<Result<LoginOutput>> {
    // 1. Validate input
    const validationResult = this.validateInput(input);
    if (validationResult.isFailure) {
      return Result.fail(validationResult.error);
    }

    // 2. Execute login via repository
    const loginResult = await this.authService.login(input);

    return loginResult;
  }

  private validateInput(input: LoginInput): Result<void> {
    if (!input.email || !input.password) {
      return Result.fail(new AuthError('Email and password are required'));
    }

    return Result.ok();
  }
}
