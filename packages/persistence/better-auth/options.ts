import { BetterAuthOptions } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
/**
 * Custom options for Better Auth
 *
 * Docs: https://www.better-auth.com/docs/reference/options
 */
export const betterAuthOptions: BetterAuthOptions = {
  appName: 'BeneFit',

  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
};
