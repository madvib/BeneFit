

import { Button, Stepper, typography, useAppForm } from '@/lib/components';
import { useRouter } from '@tanstack/react-router';
import { Activity, Target, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCreateProfile } from '@bene/react-api-client';
import { ROUTES } from '@/lib/constants';
import { useStepper } from '@/lib/hooks/use-stepper';

import { BioStep } from './bio-step';
import { ExperienceStep } from './experience-step';
import { GoalsStep } from './goals-step';
import { onboardingFormOpts } from './form-options';

// Define steps with more metadata for the UI
const STEPS = [
  {
    id: 'experience',
    title: 'Experience Level',
    icon: Activity,
    description: 'Help us understand your fitness background',
  },
  { id: 'goals', title: 'Your Goals', icon: Target, description: 'What do you want to achieve?' },
  {
    id: 'bio',
    title: 'About You',
    icon: User,
    description: 'Just a few basics to personalize your experience',
  },
] as const;

interface OnboardingStepperProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function OnboardingStepper({ isOpen, onClose }: Readonly<OnboardingStepperProps>) {
  const router = useRouter();
  const { currentStepIndex, direction, isFirstStep, isLastStep, handleNext, handleBack } =
    useStepper(STEPS.length);
  const createProfileMutation = useCreateProfile();

  const form = useAppForm({
    ...onboardingFormOpts,
    onSubmit: async ({ value }) => {
      try {
        await createProfileMutation.mutateAsync({
          json: {
            displayName: value.displayName,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            location: value.location || '',
            bio: value.bio || '',
            experienceProfile: {
              level: value.experienceLevel,
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
              primary: value.primaryGoal,
              secondary: value.secondaryGoals,
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

        router.navigate({ to: ROUTES.USER.PLAN });
      } catch (error) {
        console.error('Failed to create profile', error);
      }
    },
  });

  const currentStep = STEPS[currentStepIndex];
  if (!currentStep) return null;

  const handleSkip = () => {
    if (onClose) {
      onClose();
    } else {
      router.navigate({ to: ROUTES.USER.ACTIVITIES });
    }
  };

  return (
    <form.AppForm>
      <Stepper
        size="lg"
        steps={STEPS}
        currentStepIndex={currentStepIndex}
        direction={direction}
        isOpen={isOpen}
        onClose={handleSkip}
        footer={
          <div className="flex w-full items-center justify-between p-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isFirstStep || createProfileMutation.isPending}
              className="rounded-xl px-4 sm:px-6"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <div className="flex items-center gap-4">
              <Button
                onClick={isLastStep ? form.handleSubmit : handleNext}
                isLoading={createProfileMutation.isPending}
                className="shadow-primary/20 min-w-30 rounded-xl px-6 shadow-lg sm:min-w-35 sm:px-8"
              >
                {isLastStep ? 'Complete Setup' : 'Continue'}
                {!isLastStep && <ArrowRight size={18} className="ml-2" />}
              </Button>
            </div>
          </div>
        }
      >
        <div className="h-full">
          {currentStep.id === 'experience' && <ExperienceStep form={form} />}
          {currentStep.id === 'goals' && <GoalsStep form={form} />}
          {currentStep.id === 'bio' && <BioStep form={form} />}

          {/* Error Message */}
          {createProfileMutation.error && (
            <div className="mt-8 px-6 pb-6">
              <div className="bg-destructive/10 text-destructive border-destructive/20 animate-in fade-in slide-in-from-top-2 rounded-xl border p-4">
                <p className={typography.h4}>Setup Error</p>
                <p className={`${typography.p} opacity-90`}>
                  {createProfileMutation.error instanceof Error
                    ? createProfileMutation.error.message
                    : 'Something went wrong. Please try again.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </Stepper>
    </form.AppForm>
  );
}
