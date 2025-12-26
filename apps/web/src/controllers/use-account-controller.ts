'use client';

import { profile } from '@bene/react-api-client';
import { useCallback } from 'react';

interface UseAccountControllerResult {
  userProfile: profile.GetProfileResponse | null;
  isLoading: boolean;
  error: Error | null;
  fetchUserProfile: () => Promise<void>;
  // TODO: Re-enable when backend PATCH /profile endpoint is added
  // updateProfile: (data: any) => Promise<void>;
  // handleSaveChanges: (formData: any) => Promise<void>;
  handleChangePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<void>;
}

export function useAccountController(): UseAccountControllerResult {
  // React Query hooks from api-client
  const profileQuery = profile.useProfile();
  // TODO: Uncomment when backend endpoint is ready
  // const updateProfileMutation = profile.useUpdateProfile();

  const fetchUserProfile = useCallback(async () => {
    if (profileQuery.error) {
      await profileQuery.refetch();
    }
  }, [profileQuery]);
  // TODO: Re-enable when backend PATCH /profile endpoint is added
  // const updateProfile = useCallback(
  //   async (data: any) => {
  //     try {
  //       await updateProfileMutation.mutateAsync(data);
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  //   [updateProfileMutation],
  // );

  // const handleSaveChanges = useCallback(
  //   async (formData: any) => {
  //     await updateProfile(formData);
  //   },
  //   [updateProfile],
  // );

  const handleChangePassword = useCallback(
    async (currentPassword: string, newPassword: string, confirmPassword: string) => {
      // TODO: Implement password change via API client when endpoint is available
      console.log('Password change attempted', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
    },
    [],
  );

  // Consolidated loading state
  const isLoading = profileQuery.isLoading;

  // Consolidated error
  const error = profileQuery.error;

  return {
    userProfile: profileQuery.data || null,
    isLoading,
    error: error as Error | null,
    fetchUserProfile,
    // TODO: Re-enable when backend endpoint is ready
    // updateProfile,
    // handleSaveChanges,
    handleChangePassword,
  };
}
