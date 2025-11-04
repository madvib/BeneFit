export { LoginUseCase } from './use-cases/login/login.use-case.js';
export { SignupUseCase } from './use-cases/signup/signup.use-case.js';
export { ResetPasswordUseCase } from './use-cases/reset-password/reset-password.use-case.js';
export { SignOutUseCase } from './use-cases/sign-out/sign-out.use-case.js';
export { GetUserProfileUseCase } from './use-cases/get-user-profile/get-user-profile.use-case.js';
export { UpdateUserProfileUseCase } from './use-cases/update-user-profile/update-user-profile.use-case.js';
export { GetCurrentUserUseCase } from './use-cases/get-current-user/get-current-user.use-case.js';
export { GetCurrentSessionUseCase } from './use-cases/get-current-session/get-current-session.use-case.js';

// Export auth DTOs
export type { LoginInput, LoginOutput } from './use-cases/login/login.use-case.js';
export type { SignupInput, SignupOutput } from './use-cases/signup/signup.use-case.js';
export type { ResetPasswordInput } from './use-cases/reset-password/reset-password.use-case.js';
export type { SignOutInput, SignOutOutput } from './use-cases/sign-out/sign-out.use-case.js';
export type { GetCurrentUserOutput } from './use-cases/get-current-user/get-current-user.use-case.js';
export type { SessionUser, GetCurrentSessionOutput } from './use-cases/get-current-session/get-current-session.use-case.js';

// Export auth errors
export * from './errors/index.js';
export type { IAuthRepository } from './ports/auth.repository.js';
