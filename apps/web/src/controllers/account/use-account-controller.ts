'use client';

import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, type UserProfileData } from '@/controllers/account';

interface UseAccountControllerResult {
  userProfile: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfileData>) => Promise<void>;
  handleSaveChanges: (formData: Partial<UserProfileData>) => Promise<void>;
  handleChangePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
}

export function useAccountController(): UseAccountControllerResult {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getUserProfile();

      if (result.success && result.data) {
        setUserProfile(result.data);
      } else {
        setError(result.error || 'Failed to fetch user profile');
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error fetching user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfileData>) => {
    try {
      const result = await updateUserProfile(data);

      if (result.success) {
        // Update local state if successful
        setUserProfile(prev => prev ? { ...prev, ...data } : null);
        return;
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating user profile:', err);
    }
  };

  const handleSaveChanges = async (formData: Partial<UserProfileData>) => {
    setError(null);
    await updateProfile(formData);
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    // Password change would typically require calling a different use case
    // For now, just log the attempt
    console.log('Password change attempted', { currentPassword, newPassword, confirmPassword });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    userProfile,
    isLoading,
    error,
    fetchUserProfile,
    updateProfile,
    handleSaveChanges,
    handleChangePassword,
  };
}