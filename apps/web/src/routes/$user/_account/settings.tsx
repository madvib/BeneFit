import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ErrorPage, FitnessGoalsForm, FitnessPreferences, LoadingSpinner, PageHeader, SectionHeader, TrainingConstraintsForm, Modal, typography } from '@/lib/components';
import { useUpdatePreferences, useUpdateGoals, useUpdateConstraints, useProfile, GetProfileResponse, authClient, type UpdateGoalsRequest, type UpdateConstraintsRequest, type PrimaryFitnessGoal, type SecondaryFitnessGoal, type UpdateTrainingConstraintsFormValues } from '@bene/react-api-client';
import {
  PrivacySettings,
} from '@/lib/components/settings';
import { ROUTES } from '@/lib/constants';
import { SettingsCard } from './-components/settings-card';
import { Target, Activity, Calendar, Clock, Dumbbell } from 'lucide-react';

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

  // Modal states
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isConstraintsModalOpen, setIsConstraintsModalOpen] = useState(false);

  const handleSaveGoals = async (
    goals: {
      primary: PrimaryFitnessGoal;
      secondary: SecondaryFitnessGoal[];
    },
  ) => {
    await updateGoalsMutation.mutateAsync({
      json: {
        goals: {
          primary: goals.primary,
          secondary: goals.secondary,
          motivation: '', // This is hardcoded in the form, not passed from the form
          successCriteria: [], // This is hardcoded in the form, not passed from the form
        },
      },
    });
    setIsGoalsModalOpen(false);
  };

  const handleSaveConstraints = async (
    constraints: UpdateTrainingConstraintsFormValues,
  ) => {
    await updateConstraintsMutation.mutateAsync({
      json: { constraints: constraints },
    });
    setIsConstraintsModalOpen(false);
  };

  return (
    <div className="space-y-10">
      <PageHeader
        title="Settings"
        description="Manage your profile, preferences, and training parameters."
        align="left"
      />

      {/* Preferences Section - Keeping only what's not redundant */}
      <section className="space-y-6">
        <SectionHeader title="General Preferences" />
        <div className="grid grid-cols-1 gap-6">
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

      {/* Training Profile Section - New Card/Modal Layout */}
      <section className="space-y-6">
        <SectionHeader title="Training Profile" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SettingsCard
            title="Fitness Goals"
            description="Your primary and secondary training objectives."
            icon={Target}
            onEdit={() => setIsGoalsModalOpen(true)}
          >
            <div className="flex flex-wrap gap-2">
              <span className={`bg-primary/10 text-primary rounded-full px-3 py-1 font-semibold capitalize ${typography.xs}`}>
                {userProfile.fitnessGoals?.primary || 'No primary goal'}
              </span>
              {(userProfile.fitnessGoals?.secondary as string[])?.map((goal) => (
                <span key={goal} className={`bg-muted text-muted-foreground rounded-full px-3 py-1 font-medium capitalize ${typography.xs}`}>
                  {goal}
                </span>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard
            title="Training Constraints"
            description="Available equipment, schedule, and limitations."
            icon={Activity}
            onEdit={() => setIsConstraintsModalOpen(true)}
          >
            <div className={`text-muted-foreground grid grid-cols-2 gap-y-2 ${typography.xs}`}>
              <div className="flex items-center gap-2">
                <Calendar size={12} />
                <span>{userProfile.trainingConstraints?.availableDays?.length || 0} days/week</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} />
                <span>{userProfile.trainingConstraints?.maxDuration || 45} mins</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <Dumbbell size={12} />
                <span className="truncate">
                  {userProfile.trainingConstraints?.availableEquipment?.length || 0} items selected
                </span>
              </div>
            </div>
          </SettingsCard>
        </div>
      </section>

      {/* Modals */}
      <Modal
        isOpen={isGoalsModalOpen}
        onClose={() => setIsGoalsModalOpen(false)}
        title="Edit Fitness Goals"
        size="lg"
      >
        <div className="p-1">
          <FitnessGoalsForm
            initialPrimary={(userProfile.fitnessGoals?.primary as any) || 'strength'}
            initialSecondary={(userProfile.fitnessGoals?.secondary as any) || []}
            onSave={handleSaveGoals}
            isLoading={updateGoalsMutation.isPending}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isConstraintsModalOpen}
        onClose={() => setIsConstraintsModalOpen(false)}
        title="Edit Training Constraints"
        size="xl"
      >
        <div className="p-1">
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
      </Modal>
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
