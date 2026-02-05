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
export * as trainingSchemas from './schemas/training';
export * as coachSchemas from './schemas/coach';

export * from './schemas/training/index.js';
export * from './schemas/coach/index.js';

// Export all hooks
export * from './hooks/use-coach';
export * from './hooks/use-profile';
export * from './hooks/use-fitness-plan';
export * from './hooks/use-workouts';
export * from './hooks/use-integrations';
export * from './hooks/use-session';
export * from './hooks/use-websocket';
export { useSession } from './hooks/use-session';

