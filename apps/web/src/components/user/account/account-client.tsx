'use client';

import { PageContainer } from '@/components';
import { useAccountController } from '@/controllers/account';
import PersonalInfoForm from './personal-info-form';
import SecurityForm from './security-form';
import SaveChangesButton from './save-changes-button';
import { useState, useEffect } from 'react';

export default function AccountClient() {
  const {
    userProfile,
    isLoading,
    error,
    handleSaveChanges,
    handleChangePassword
  } = useAccountController();

  const [formState, setFormState] = useState({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormState({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || ''
      });
    }
  }, [userProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    await handleSaveChanges(formState);
  };

  if (isLoading) {
    return (
      <PageContainer title="Account">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Account">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={userProfile?.email || 'Account'}>
      <div className="bg-secondary p-6 rounded-lg shadow-md max-w-3xl">
        <PersonalInfoForm
          firstName={formState.firstName}
          lastName={formState.lastName}
          email={formState.email}
          phone={formState.phone}
          onInputChange={handleInputChange}
        />
        
        <SecurityForm onPasswordChange={handleChangePassword} />
        
        <SaveChangesButton 
          onClick={handleSave}
          disabled={isLoading}
        />
      </div>
    </PageContainer>
  );
}