'use client';

import { LoadingSpinner, ErrorPage } from '@/components';
import Spacer from '@/components/common/ui-primitives/spacer/spacer';
import { PersonalInfoForm, SecurityForm } from '@/components/user/account';
import { PageHeader } from '@/components/user/account/shared/page-header';
import { useAccountController } from '@/controllers';

export default function AccountClient() {
  const { isLoading, error } = useAccountController();

  if (isLoading) {
    return <LoadingSpinner variant="screen" text="Loading account settings..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Account Settings Loading Error"
        message="Unable to load your account settings."
        error={error}
        backHref="/"
      />
    );
  }

  return (
    <div>
      <PageHeader title="Account Settings" description="Manage your account settings" />
      <PersonalInfoForm />
      <Spacer />
      <SecurityForm />
    </div>
  );
}
