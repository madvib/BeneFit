'use client';

import { useState, useEffect } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { authClient } from '@bene/react-api-client';
import { Button, LoadingSpinner } from '@/lib/components';
import { OAuthButton } from '@/lib/components/auth';

export default function OAuthProviderList() {
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);

        // Get already linked providers
        if (session?.user) {
          const linkedAccounts = await authClient.listAccounts();
          if (linkedAccounts.data) {
            const linkedProviderIds = linkedAccounts.data
              .map((account) => account.providerId)
              .filter(Boolean) as string[];
            setProviders(linkedProviderIds);
          }
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProviders();
    }
  }, [session]);

  const unlinkProvider = async (providerId: string) => {
    try {
      const result = await authClient.unlinkAccount({
        providerId,
      });

      if (!result.error) {
        // Refresh the provider list
        const linkedAccounts = await authClient.listAccounts();
        if (linkedAccounts.data) {
          const linkedProviderIds = linkedAccounts.data
            .map((account) => account.providerId)
            .filter(Boolean) as string[];
          setProviders(linkedProviderIds);
        }
      }
    } catch (err) {
      console.error('Error unlinking provider:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  const googleConnected = providers.includes('google');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
            {googleConnected ? (
              <Check className="text-green-500" size={20} />
            ) : (
              <ExternalLink size={20} />
            )}
          </div>
          <div>
            <div className="font-medium capitalize">Google</div>
            <div className="text-muted-foreground text-sm">
              {googleConnected ? 'Connected' : 'Not connected'}
            </div>
          </div>
        </div>

        {googleConnected ? (
          <Button variant="outline" size="sm" onClick={() => unlinkProvider('google')}>
            Unlink
          </Button>
        ) : (
          <OAuthButton provider="google" mode="link" text="Link" />
        )}
      </div>
    </div>
  );
}
