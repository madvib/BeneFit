import type { Context, Next } from 'hono';
import { createAuth } from '../lib/better-auth/auth';

export const authMiddleware = async (c: Context, next: Next) => {
  const auth = createAuth(c.env.DB_USER_AUTH);

  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session?.user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Set authenticated user in context
  c.set('user', session.user);

  // Dev-only verbose logging
  if (import.meta.env.DEV && import.meta.env.VERBOSE_LOGGING) {
    console.log(`🔐 Auth: ${ session.user.email || session.user.id }`);
  }

  await next();
};
