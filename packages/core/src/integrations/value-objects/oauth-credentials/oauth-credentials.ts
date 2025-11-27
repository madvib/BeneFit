import { Guard, Result } from '@shared';

interface OAuthCredentialsData {
  accessToken: string; // Should be encrypted at rest
  refreshToken?: string; // Should be encrypted at rest
  expiresAt?: Date;
  scopes: string[];
  tokenType: 'Bearer' | 'OAuth';
}

export type OAuthCredentials = Readonly<OAuthCredentialsData>;

export function createOAuthCredentials(props: {
  accessToken: string;
  scopes: string[];
  refreshToken?: string;
  expiresAt?: Date;
  tokenType?: 'Bearer' | 'OAuth';
}): Result<OAuthCredentials> {
  const guards = [
    Guard.againstNullOrUndefinedBulk([
      { argument: props.accessToken, argumentName: 'accessToken' },
      { argument: props.scopes, argumentName: 'scopes' },
    ]),

    Guard.againstEmptyString(props.accessToken, 'accessToken'),
    Guard.isTrue(props.scopes.length > 0, 'scopes array cannot be empty'),
  ];
  if (props.expiresAt) {
    guards.push(
      Guard.isTrue(props.expiresAt > new Date(), 'expiresAt must be in the future'),
    );
  }
  const guardResult = Guard.combine(guards);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    accessToken: props.accessToken,
    refreshToken: props.refreshToken,
    expiresAt: props.expiresAt,
    scopes: props.scopes,
    tokenType: props.tokenType || 'Bearer',
  });
}

export function isCredentialExpired(credentials: OAuthCredentials): boolean {
  if (!credentials.expiresAt) {
    return false; // No expiry = never expires
  }

  return credentials.expiresAt <= new Date();
}

export function willExpireSoon(
  credentials: OAuthCredentials,
  minutesThreshold: number = 30,
): boolean {
  if (!credentials.expiresAt) {
    return false;
  }

  const threshold = new Date(Date.now() + minutesThreshold * 60 * 1000);
  return credentials.expiresAt <= threshold;
}
