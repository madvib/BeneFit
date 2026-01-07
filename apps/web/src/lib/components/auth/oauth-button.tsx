'use client';

import { useState } from 'react';
import { Button } from '@/lib/components';
import { authClient } from '@bene/react-api-client';

type OAuthProvider = 'google' | 'strava';

interface OAuthButtonProps {
  provider: OAuthProvider;
  text?: string;
  mode?: 'signin' | 'link';
  callbackURL?: string;
}

export function OAuthButton({
  provider,
  text = `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
  mode = 'signin',
  callbackURL = '/user/activities',
}: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await (mode === 'link'
        ? authClient.linkSocial({
            provider,
            callbackURL: `${globalThis.location.origin}/user/account`,
          })
        : authClient.signIn.social({
            provider,
            callbackURL: `${globalThis.location.origin}${callbackURL}`,
          }));
      // Note: Better Auth will handle the redirect, so we don't set isLoading to false
    } catch (error) {
      console.error(`OAuth with ${provider} failed`, error);
      setIsLoading(false);
    }
  };

  const getGoogleIcon = () => {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    );
  };

  const getStravaIcon = () => {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#FC4C02">
        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
      </svg>
    );
  };

  const getIcon = () => {
    switch (provider) {
      case 'google':
        return getGoogleIcon();
      case 'strava':
        return getStravaIcon();
      default:
        return null;
    }
  };

  return (
    <Button
      variant="outline"
      className="flex w-full items-center justify-center gap-3"
      onClick={handleClick}
      disabled={isLoading}
    >
      {getIcon()}
      <span>{text}</span>
    </Button>
  );
}
