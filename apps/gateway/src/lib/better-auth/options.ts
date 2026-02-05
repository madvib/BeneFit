import { BetterAuthOptions } from 'better-auth';
import { strava } from './providers/strava.js';
import { env } from 'cloudflare:workers';

/**
 * Custom options for Better Auth
 *
 * Docs: https://www.better-auth.com/docs/reference/options
 */
export const betterAuthOptions: BetterAuthOptions = {
  trustedOrigins: ['http://localhost:3000', 'https://getbene.fit'],
  appName: 'BeneFit',
  baseURL: env.BETTER_AUTH_URL || 'http://localhost:8787',
  secret: env.BETTER_AUTH_SECRET || '',

  // Email & Password Authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // TODO: Enable after setting up email provider
    sendResetPassword: async ({ user, url }) => {
      // TODO: Implement email sending via Resend
      console.log(`Password reset for ${ user.email }: ${ url }`);
    },
  },

  // Session Configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // Advanced Security
  advanced: {
    database: {
      generateId: 'uuid'
    },
    cookiePrefix: 'bene',
    crossSubDomainCookies: {
      enabled: false, // Enable if using subdomains
    },
    useSecureCookies: import.meta.env.PROD,

  },

  // Rate Limiting (recommended for production)
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute window
    max: 10, // 10 requests per window
  },

  // Social Providers (add as needed)
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || '',
      enabled: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
    },
  },

  // Plugins
  plugins: [
    strava({
      clientId: env.STRAVA_CLIENT_ID || '',
      clientSecret: env.STRAVA_CLIENT_SECRET || '',
    }),
    // TODO: Add email provider plugin when ready
    // Example with Resend:
    // resend({
    //   apiKey: env.RESEND_API_KEY,
    //   from: 'noreply@getbene.fit',
    // }),
  ],
};
