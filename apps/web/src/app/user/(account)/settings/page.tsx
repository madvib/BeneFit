'use client';

import { profile } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage } from '@/lib/components';
import { PageHeader } from '../#shared/page-header';
import { PrivacySettings, FitnessPreferences } from './#components';
import { FitnessGoalsForm } from './#components/fitness-goals-form';
import { TrainingConstraintsForm } from './#components/training-constraints-form';
import { ROUTES } from '@/lib/constants';

function SettingsContent({
  userProfile,
}: {
  userProfile: NonNullable<profile.GetProfileResponse>;
}) {
  const updatePreferencesMutation = profile.useUpdatePreferences();
  const updateGoalsMutation = profile.useUpdateGoals();
  const updateConstraintsMutation = profile.useUpdateConstraints();

  const preferences = userProfile.preferences;

  const handlePrivacyChange = (updates: { privacy: Partial<typeof preferences.privacy> }) => {
    updatePreferencesMutation.mutate({
      json: {
        ...preferences,
        privacy: { ...preferences.privacy, ...updates.privacy },
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
        ...preferences,
        ...(updates.units && { units: updates.units }),
        ...(updates.coaching && {
          coaching: {
            ...preferences.coaching,
            ...updates.coaching,
          },
        }),
      },
    });
  };

  const handleSaveGoals = async (goals: { primary: string; secondary: string[] }) => {
    await updateGoalsMutation.mutateAsync({
      json: {
        goals: {
          primary: goals.primary,
          secondary: goals.secondary,
          motivation: '',
          successCriteria: [],
        },
      },
    });
  };

  const handleSaveConstraints = async (
    constraints: NonNullable<typeof preferences>['trainingConstraints'],
  ) => {
    await updateConstraintsMutation.mutateAsync({
      json: constraints,
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your profile, preferences, and training parameters."
      />

      <section>
        <h2 className="mb-4 text-xl font-bold">Preferences</h2>
        <div className="space-y-4">
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
        <h2 className="mb-4 text-xl font-bold">Training Profile</h2>
        <div className="space-y-4">
          <FitnessGoalsForm
            initialPrimary={userProfile.preferences?.fitnessGoals?.primary || 'strength'}
            initialSecondary={userProfile.preferences?.fitnessGoals?.secondary || []}
            onSave={handleSaveGoals}
            isLoading={updateGoalsMutation.isPending}
          />

          <TrainingConstraintsForm
            initialConstraints={
              userProfile.preferences?.trainingConstraints || {
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

export default function SettingsClient() {
  const profileQuery = profile.useProfile();

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
