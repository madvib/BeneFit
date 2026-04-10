import { BetterAuthOptions } from 'better-auth';
import { Resend } from 'resend';
import { strava } from './providers/strava.js';
import { env } from 'cloudflare:workers';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const fromEmail = env.EMAIL_FROM || 'BeneFit <noreply@getbene.fit>';

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log(`[email stub] To: ${to}, Subject: ${subject}`);
    return;
  }
  await resend.emails.send({ from: fromEmail, to, subject, html });
}

/**
 * Custom options for Better Auth
 *
 * Docs: https://www.better-auth.com/docs/reference/options
 */
export const betterAuthOptions: BetterAuthOptions = {
  trustedOrigins: (env.TRUSTED_ORIGINS || 'http://localhost:3000').split(','),
  appName: 'BeneFit',
  baseURL: env.BETTER_AUTH_URL || 'http://localhost:8787',
  secret: env.BETTER_AUTH_SECRET || '',

  // Email & Password Authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: !!env.RESEND_API_KEY,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail(
        user.email,
        'Reset your BeneFit password',
        `<p>Click <a href="${url}">here</a> to reset your password.</p><p>If you didn't request this, ignore this email.</p>`,
      );
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail(
        user.email,
        'Verify your BeneFit email',
        `<p>Welcome to BeneFit! Click <a href="${url}">here</a> to verify your email address.</p>`,
      );
    },
    sendOnSignUp: !!env.RESEND_API_KEY,
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
  ],
};
