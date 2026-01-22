export * from './client';
export * from './websocket';
export {
  authClient,
  getAuthErrorMessage,
  getAuthErrorContext,
  type AuthErrorContext,
} from './lib/auth/auth.js';
export type { AuthSession, AuthUser, AuthError } from './lib/auth/auth.js';
export * as authSchemas from './schemas/auth';

// Export all hooks
export * from './hooks/use-coach/use-coach';
export * from './hooks/use-profile/use-profile';
export * from './hooks/use-fitness-plan/use-fitness-plan';
export * from './hooks/use-workouts/use-workouts';
export * from './hooks/use-integrations/use-integrations';
export * from './hooks/use-session';
export * from './hooks/use-websocket';
export { useSession } from './hooks/use-session';
