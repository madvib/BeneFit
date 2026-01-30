import { createFileRoute } from '@tanstack/react-router';
import { AccountSettingsForm, ErrorPage, FitnessGoalsForm, FitnessPreferences, LoadingSpinner, PageHeader, SectionHeader, TrainingConstraintsForm } from '@/lib/components';
import { useUpdatePreferences, useUpdateGoals, useUpdateConstraints, useProfile, GetProfileResponse, authClient } from '@bene/react-api-client';
import {
  NotificationPreferences,
  PrivacySettings,
} from '@/lib/components/settings';
import { ROUTES } from '@/lib/constants';

export const Route = createFileRoute('/$user/_account/settings')({
  component: SettingsClient,
});

function SettingsContent({
  userProfile,
}: {
  userProfile: NonNullable<GetProfileResponse>;
}) {
  const updatePreferencesMutation = useUpdatePreferences();
  const updateGoalsMutation = useUpdateGoals();
  const updateConstraintsMutation = useUpdateConstraints();
  const { data: session } = authClient.useSession();

  const preferences = userProfile.preferences;

  const handlePrivacyChange = (updates: { privacy: Partial<typeof preferences.privacy> }) => {
    updatePreferencesMutation.mutate({
      json: {
        preferences: {
          privacy: { ...preferences.privacy, ...updates.privacy },
        },
      },
    });
  };

  type FitnessPreferencesUpdate = {
    units?: 'metric' | 'imperial';
    coaching?: { tone?: 'motivational' | 'casual' | 'professional' | 'tough_love' };
  };

  const handleFitnessPreferencesChange = (updates: FitnessPreferencesUpdate) => {
    updatePreferencesMutation.mutate({
      json: {
        preferences: {
          ...(updates.units && { units: updates.units }),
          ...(updates.coaching && {
            coaching: {
              ...preferences.coaching,
              ...updates.coaching,
            },
          }),
        },
      },
    });
  };

  const handleSaveGoals = async (goals: any) => {
    await updateGoalsMutation.mutateAsync({
      json: {
        goals: {
          primary: goals.primary as any,
          secondary: goals.secondary as any,
          motivation: '',
          successCriteria: [],
        },
      },
    });
  };

  const handleSaveConstraints = async (
    constraints: any,
  ) => {
    await updateConstraintsMutation.mutateAsync({
      json: { constraints: constraints as any },
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your profile, preferences, and training parameters."
      />

      <section>
        <SectionHeader title="Account & Security" className="mb-4" />
        <div className="space-y-4">
          <AccountSettingsForm
            initialName={userProfile.displayName}
            initialEmail={session?.user?.email || ''}
            onSave={async (data) => {
              // TODO: Implement account update mutation
              console.log('Update account:', data);
            }}
          />
          <PrivacySettings
            profileVisibility={preferences.privacy?.profileVisible ? 'Public' : 'Private'}
            activitySharing={preferences.privacy?.workoutsPublic || false}
            onProfileVisibilityChange={(value) =>
              handlePrivacyChange({ privacy: { profileVisible: value === 'Public' } })
            }
            onActivitySharingChange={(checked) =>
              handlePrivacyChange({ privacy: { workoutsPublic: checked } })
            }
          />
        </div>
      </section>

      <section>
        <SectionHeader title="Preferences" className="mb-4" />
        <div className="space-y-4">
          <NotificationPreferences
            emailNotifications={true} // TODO: Add to schema
            pushNotifications={false}
            workoutReminders={true}
            onEmailNotificationsChange={() => {}}
            onPushNotificationsChange={() => {}}
            onWorkoutRemindersChange={() => {}}
          />
          <FitnessPreferences
            preferredUnits={(preferences.units as 'metric' | 'imperial') || 'metric'}
            goalFocus={
              (preferences.coaching?.tone as
                | 'motivational'
                | 'casual'
                | 'professional'
                | 'tough_love') || 'motivational'
            }
            onPreferredUnitsChange={(value) =>
              handleFitnessPreferencesChange({ units: value as 'metric' | 'imperial' })
            }
            onGoalFocusChange={(value) =>
              handleFitnessPreferencesChange({
                coaching: {
                  tone: value as 'motivational' | 'casual' | 'professional' | 'tough_love',
                },
              })
            }
          />
        </div>
      </section>

      <section>
        <SectionHeader title="Training Profile" className="mb-4" />
        <div className="space-y-4">
          <FitnessGoalsForm
            initialPrimary={(userProfile.fitnessGoals?.primary as any) || 'strength'}
            initialSecondary={(userProfile.fitnessGoals?.secondary as any) || []}
            onSave={handleSaveGoals}
            isLoading={updateGoalsMutation.isPending}
          />

          <TrainingConstraintsForm
            initialConstraints={
              userProfile.trainingConstraints || {
                availableDays: [],
                availableEquipment: [],
                maxDuration: 45,
                injuries: [],
              }
            }
            onSave={handleSaveConstraints}
            isLoading={updateConstraintsMutation.isPending}
          />
        </div>
      </section>
    </div>
  );
}

function SettingsClient() {
  const profileQuery = useProfile();

  if (profileQuery.isLoading) {
    return <LoadingSpinner text="Loading settings..." variant="screen" />;
  }

  const userProfile = profileQuery.data;
  const settings = userProfile?.preferences;
  const error = profileQuery.error;

  if (error || !userProfile || !settings) {
    return (
      <ErrorPage
        title="Settings Loading Error"
        message={error ? 'Unable to load your settings.' : 'Failed to load settings data.'}
        error={error || new Error('Failed to load settings')}
        backHref={ROUTES.HOME}
      />
    );
  }

  // Render content only when settings are available
  return <SettingsContent userProfile={userProfile} />;
}
