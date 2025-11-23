'use client';

import { LoadingSpinner, PageContainer, ErrorPage, Card } from '@/components';
import Spacer from '@/components/common/ui-primitives/spacer/spacer';
import { PersonalInfoForm, SecurityForm } from '@/components/user/account';
import { PageHeader } from '@/components/user/account/shared/page-header';
import { SaveChangesButton } from '@/components/user/profile';
import { useAccountController } from '@/controllers/account';

import { useState, useEffect, useEffectEvent } from 'react';

export default function AccountClient() {
  const { userProfile, isLoading, error, handleSaveChanges, handleChangePassword } =
    useAccountController();

  const [formState, setFormState] = useState({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
  });

  const syncFormState = useEffectEvent(() => {
    if (userProfile) {
      setFormState({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
      });
    }
  });

  useEffect(() => {
    syncFormState();
  }, [userProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    await handleSaveChanges(formState);
  };

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
      <PersonalInfoForm
        firstName={formState.firstName}
        lastName={formState.lastName}
        email={formState.email}
        phone={formState.phone}
        onInputChange={handleInputChange}
      />
      <Spacer />
      <SecurityForm onPasswordChange={handleChangePassword} />
      <Spacer />

      <SaveChangesButton onClick={handleSave} disabled={isLoading} />
    </div>
  );
}
