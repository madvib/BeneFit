'use client';

import { useState } from 'react';
import { Check, AlertCircle, ChevronDown, ChevronUp, Link } from 'lucide-react';
import { authClient } from '@bene/react-api-client';
import { Card, Button } from '@/lib/components';
import { ROUTES } from '@/lib/constants';

export default function SessionInfo() {
  const [showSessionInfo, setShowSessionInfo] = useState(false);
  const { data } = authClient.useSession();
  const isEmailVerified = data?.user?.emailVerified ?? false;

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className="cursor-pointer p-6" onClick={() => setShowSessionInfo(!showSessionInfo)}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Session Information</h2>
          {showSessionInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {showSessionInfo && (
        <div className="px-6 pb-6">
          {data?.user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <span className="flex items-center gap-2">
                  {isEmailVerified ? (
                    <>
                      <Check className="text-green-500" size={16} />
                      Authenticated & Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle className="text-yellow-500" size={16} />
                      Authenticated (Email Unverified)
                    </>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <span className="mb-1 block font-medium">User ID:</span>
                  <span className="text-muted-foreground">{data.user.id}</span>
                </div>

                <div>
                  <span className="mb-1 block font-medium">Email:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{data.user.email}</span>
                    {!isEmailVerified && (
                      <Link
                        href={ROUTES.AUTH.CONFIRM_EMAIL}
                        className="text-primary text-sm hover:underline"
                      >
                        Verify
                      </Link>
                    )}
                  </div>
                </div>

                <div>
                  <span className="mb-1 block font-medium">Name:</span>
                  <span className="text-muted-foreground">
                    {data.user.name || 'Not provided'}
                  </span>
                </div>

                <div>
                  <span className="mb-1 block font-medium">Email Verified:</span>
                  <span className="text-muted-foreground flex items-center gap-2">
                    {data.user.emailVerified ? (
                      <>
                        <Check className="text-green-500" size={16} /> Yes
                      </>
                    ) : (
                      <>
                        <AlertCircle className="text-yellow-500" size={16} /> No
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <span className="mb-1 block font-medium">Created At:</span>
                  <span className="text-muted-foreground">
                    {data.user.createdAt
                      ? new Date(data.user.createdAt).toLocaleString()
                      : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">
              No active session. Redirecting to login...
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
