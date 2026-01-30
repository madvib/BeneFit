import { ROUTES } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { useLocation } from '@tanstack/react-router';
import { useProfile, useCreateProfile } from '@bene/react-api-client';
import { OnboardingStepper } from '@/lib/components/fitness/setup/onboarding-stepper/onboarding-stepper';

// List of paths that should bypass profile check to avoid loops
const BYPASS_PATHS = [ROUTES.ONBOARDING];

export function RequireProfile({ children }: Readonly<{ children: React.ReactNode }>) {
  // const router = useRouter(); // Unused
  const pathname = useLocation().pathname;
  const { data: userProfile, isPending, error } = useProfile();
  const createProfileMutation = useCreateProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isPending) return;

    // If we are already on onboarding, don't do anything
    if (pathname && BYPASS_PATHS.some((p) => pathname.startsWith(p))) return;

    // Check if profile is missing or is a default profile (auto-created by backend)
    const isMissing = !userProfile && !isPending;
    const isDefault = userProfile?.displayName === 'New User';

    if (isMissing || isDefault) {
      const hasShown = sessionStorage.getItem('bene_onboarding_shown');
      if (!hasShown) {
        setIsModalOpen(true);
        sessionStorage.setItem('bene_onboarding_shown', 'true');
      }
    }
  }, [userProfile, isPending, error, pathname]);

  const handleClose = async () => {
    setIsModalOpen(false);

    // If closed without a profile, create a default one to stop nagging
    if (!userProfile) {
      try {
        await createProfileMutation.mutateAsync({
          json: {
            displayName: 'New User',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            location: '',
            bio: '',
            experienceProfile: {
              level: 'beginner',
              history: {
                previousPrograms: [],
                sports: [],
                certifications: [],
                yearsTraining: 0,
              },
              capabilities: {
                canDoFullPushup: false,
                canDoFullPullup: false,
                canRunMile: false,
                canSquatBelowParallel: false,
              },
            },
            fitnessGoals: {
              primary: 'strength',
              secondary: [],
              motivation: 'Improve overall health',
              successCriteria: [],
            },
            trainingConstraints: {
              location: 'mixed',
              availableDays: [],
              availableEquipment: [],
              maxDuration: 60,
              injuries: [],
            },
          },
        });
      } catch (err) {
        console.error('Failed to create default profile:', err);
      }
    }
  };

  // Eagerly render children. Do not block on loading.
  // This prevents infinite loops if the child routes handle missing profiles gracefully.
  return (
    <>
      {children}
      <OnboardingStepper isOpen={isModalOpen} onClose={handleClose} />
    </>
  );
}
