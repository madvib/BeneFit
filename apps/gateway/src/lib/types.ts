/**
 * Authenticated user from better-auth session.
 * This is the shape set by authMiddleware via c.set('user', session.user).
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Standard Hono env + variables for authenticated gateway routes */
export type GatewayEnv = {
  Bindings: Env;
  Variables: { user: AuthUser };
};
