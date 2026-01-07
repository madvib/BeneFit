import { genericOAuth } from "better-auth/plugins";

const STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const STRAVA_USERINFO_URL = "https://www.strava.com/api/v3/athlete";
const DEFAULT_SCOPES = ["read", "profile:read_all", "activity:read_all"];

export interface StravaProfile {
  id: number;
  firstname?: string | null;
  lastname?: string | null;
  username?: string | null;
  email?: string | null;
  profile?: string | null;
  profile_medium?: string | null;
}

export interface StravaProviderOptions {
  clientId: string;
  clientSecret: string;
  redirectURI?: string;
  scopes?: string[];
  approvalPrompt?: "auto" | "force";
  accessType?: "offline" | "online";
}

// Normalizes a Strava athlete payload to the user metadata shape expected by better-auth.
export const mapStravaProfileToUser = (athlete: StravaProfile) => {
  const fullName = [athlete.firstname, athlete.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();

  // Strava doesn't provide email in most cases, even with profile:read_all scope.
  // We generate a deterministic placeholder email to satisfy better-auth requirements.
  // Apps can identify placeholder emails by checking the @strava.local domain.
  const email = athlete.email || `athlete-${ athlete.id }@strava.local`;

  return {
    email,
    emailVerified: !!athlete.email, // Only verified if Strava actually provided it
    name: fullName || athlete.username || undefined,
    image: athlete.profile || athlete.profile_medium || undefined,
    metadata: {
      stravaAthleteId: athlete.id,
      stravaUsername: athlete.username,
      stravaProfileImage: athlete.profile,
      hasPlaceholderEmail: !athlete.email, // Flag to identify generated emails
    },
  };
};

export const strava = (options: StravaProviderOptions) => {
  // Strava requires comma-separated scopes in a single string
  const scopeString = (options.scopes ?? DEFAULT_SCOPES).join(",");

  return genericOAuth({
    config: [
      {
        providerId: "strava",
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        authorizationUrl: STRAVA_AUTH_URL,
        tokenUrl: STRAVA_TOKEN_URL,
        userInfoUrl: STRAVA_USERINFO_URL,
        redirectURI: options.redirectURI,
        scopes: [scopeString], // Pass as single string with comma-separated values
        accessType: options.accessType ?? "offline",
        authorizationUrlParams: {
          approval_prompt: options.approvalPrompt ?? "auto",
        },
        mapProfileToUser: (profile) =>
          mapStravaProfileToUser(profile as StravaProfile),
      },
    ],
  });
};

export type { StravaProviderOptions as StravaOptions };
