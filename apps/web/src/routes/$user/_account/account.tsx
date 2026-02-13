import { createFileRoute } from '@tanstack/react-router';
import { authClient } from '@bene/react-api-client';
import {
  ErrorPage,
  LoadingSpinner,
  OAuthProviderList,
  PageHeader,
  PersonalInfoForm,
  SecurityForm,
  SessionInfo,
} from '@/lib/components';
import { ROUTES } from '@/lib/constants';

export const Route = createFileRoute('/$user/_account/account')({
  component: AccountClient,
});

function AccountClient() {
  const { data, isPending, error } = authClient().useSession();

  if (isPending) {
    return <LoadingSpinner variant="screen" text="Loading account settings..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Account Settings Loading Error"
        message="Unable to load your account settings."
        error={error}
        backHref={ROUTES.USER.ACTIVITIES}
      />
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Account Settings"
        description="Manage your account settings"
        align="left"
      />

      <div className="space-y-8">
        {/* Personal Info Form */}
        <PersonalInfoForm
          initialData={{
            name: data?.user?.name || '',
            email: data?.user?.email || '',
            emailVerified: data?.user?.emailVerified || false,
          }}
        />

        {/* Security Form */}
        <SecurityForm />

        {/* OAuth Providers */}
        <OAuthProviderList />

        <div className="border-t pt-8">
          <SessionInfo />
        </div>
      </div>
    </div>
  );
}
