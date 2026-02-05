/* eslint-disable */
// This file removes durable object imports for typed client build
declare namespace Cloudflare {
  interface GlobalProps {
    mainModule: typeof import('./src/index');
  }
  interface Env {
    VITE_API_BASE_URL: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    CLOUDFLARE_USER_AUTH_DATABASE_ID: string;
    CLOUDFLARE_D1_TOKEN: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    STRAVA_CLIENT_ID: string;
    STRAVA_CLIENT_SECRET: string;
    USER_HUB: DurableObjectNamespace<any>;
    WORKOUT_SESSION: DurableObjectNamespace<any>;
    DB_USER_AUTH: D1Database;
  }
}
interface Env extends Cloudflare.Env { }
type StringifyValues<EnvType extends Record<string, unknown>> = {
  [Binding in keyof EnvType]: EnvType[Binding] extends string
  ? EnvType[Binding]
  : string;
};
declare namespace NodeJS {
  interface ProcessEnv extends StringifyValues<
    Pick<
      Cloudflare.Env,
      | 'NODE_ENV'
      | 'BETTER_AUTH_SECRET'
      | 'BETTER_AUTH_URL'
      | 'CLOUDFLARE_ACCOUNT_ID'
      | 'CLOUDFLARE_USER_AUTH_DATABASE_ID'
      | 'CLOUDFLARE_D1_TOKEN'
    >
  > { }
}
