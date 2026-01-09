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
export * as coach from './hooks/use-coach';
export * as fitnessPlan from './hooks/use-fitness-plan';
export * as integrations from './hooks/use-integrations';
export * as profile from './hooks/use-profile';
export * as workouts from './hooks/use-workouts';
export * as wss from './hooks/use-websocket';
export { useSession } from './hooks/use-session';
