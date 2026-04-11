import type { Context, Next } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { user } from '../lib/better-auth/schema.js';

/**
 * Middleware that gates routes to Pro subscribers only.
 * Must be used after authMiddleware (requires c.get('user')).
 */
export const requirePro = async (c: Context, next: Next) => {
  const authUser = c.get('user');
  if (!authUser) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const db = drizzle(c.env.DB_USER_AUTH);
  const [dbUser] = await db
    .select({ subscriptionPlan: user.subscriptionPlan })
    .from(user)
    .where(eq(user.id, authUser.id))
    .limit(1);

  if (!dbUser || dbUser.subscriptionPlan !== 'pro') {
    return c.json({ error: 'Pro subscription required', code: 'PLAN_REQUIRED' }, 403);
  }

  await next();
};
