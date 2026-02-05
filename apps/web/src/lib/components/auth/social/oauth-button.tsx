
import { Button, GoogleLogo, StravaLogo } from '@/lib/components';
import { useState } from 'react';
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

  const getIcon = () => {
    switch (provider) {
      case 'google':
        return <GoogleLogo className="h-5 w-5" />;
      case 'strava':
        return <StravaLogo className="h-5 w-5" />;
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
