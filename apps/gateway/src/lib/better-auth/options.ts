import { BetterAuthOptions } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { env } from 'cloudflare:workers';
/**
 * Custom options for Better Auth
 *
 * Docs: https://www.better-auth.com/docs/reference/options
 */
export const betterAuthOptions: BetterAuthOptions = {
  trustedOrigins: ['http://localhost:3000', 'https://getbene.fit'],
  appName: 'BeneFit',
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
};
