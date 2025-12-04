import { Result } from '@bene/shared-domain';
import { LoginInput, LoginOutput } from '../use-cases/login/login.use-case.js';
import { SignupInput } from '../use-cases/signup/signup.use-case.js';
import { ResetPasswordInput } from '../use-cases/reset-password/reset-password.use-case.js';
import { User } from '@core/index.js';

/**
 * Repository interface for Auth
 */
export interface IAuthService {
  login(input: LoginInput): Promise<Result<LoginOutput>>;
  signup(input: SignupInput): Promise<Result<void>>;
  resetPassword(input: ResetPasswordInput): Promise<Result<void>>;
  signOut(input: RequestContext): Promise<Result<void>>;
  getCurrentUser(input: RequestContext): Promise<Result<User>>;
  getSession(input: RequestContext): Promise<Result<boolean>>;
}

export interface RequestContext {
  headers: Headers;
  cookies: Record<string, string>[];
}
