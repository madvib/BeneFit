'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { profile } from '@bene/react-api-client';
import { Button } from '@/lib/components';
import { useAppForm } from '@/lib/components/app-form/app-form';
import { ROUTES } from '@/lib/constants';
import { User, Activity, Target, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Modal } from '@/lib/components/ui-primitives/modal/modal';

import { BioStep } from './bio-step';
import { ExperienceStep } from './experience-step';
import { GoalsStep } from './goals-step';

import { onboardingFormOpts } from './form-options';

// Reordered steps: Experience → Goals → Bio
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

export default function OnboardingWizard() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const createProfileMutation = profile.useCreateProfile();

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
              lastAssessmentDate: new Date().toISOString(),
            },
            fitnessGoals: {
              primary: value.primaryGoal,
              secondary: value.secondaryGoals,
              motivation: 'Improve overall health',
              successCriteria: [],
            },
            // TODO: Training constraints removed from onboarding - will be collected during plan generation
            trainingConstraints: {
              location: 'mixed',
              availableDays: [],
              availableEquipment: [],
              maxDuration: 60,
              injuries: [],
            },
          },
        });

        // Redirect to Plan generation
        router.push(ROUTES.USER.PLAN);
      } catch (error) {
        console.error('Failed to create profile', error);
      }
    },
  });

  const currentStep = STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === STEPS.length - 1;
  const isFirstStep = currentStepIndex === 0;

  if (!currentStep) return null;

  const validateCurrentStep = async () => {
    let isValid = true;
    if (currentStep.id === 'bio') {
      if (!form.getFieldValue('displayName')) {
        form.validateField('displayName', 'change');
        isValid = false;
      }
      return isValid;
    }
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    if (isLastStep) {
      form.handleSubmit();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    // TODO: Store skip state in backend
    router.push(ROUTES.USER.ACTIVITIES);
  };

  return (
    <Modal onClose={handleSkip}>
      <form.AppForm>
        <div className="pb-safe space-y-6 p-6 sm:p-8">
          {/* Header Badge */}
          <div className="text-center">
            <div className="bg-background border-muted mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-sm sm:px-4 sm:py-1.5 sm:text-sm">
              <Sparkles size={14} className="text-primary animate-pulse sm:size-4" />
              <span className="text-foreground">Quick Setup</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="text-muted-foreground flex justify-between text-[10px] font-medium tracking-wider uppercase sm:text-xs">
              <span>Start</span>
              <span>Finish</span>
            </div>
            <div className="bg-secondary/50 relative h-1.5 w-full overflow-hidden rounded-full sm:h-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <div className="bg-primary/10 text-primary mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-sm sm:mb-4 sm:h-14 sm:w-14 sm:rounded-2xl">
              <currentStep.icon size={24} className="sm:size-7" />
            </div>
            <h1 className="text-foreground mb-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {currentStep.title}
            </h1>
            <p className="text-muted-foreground mx-auto max-w-sm text-sm sm:text-base">
              {currentStep.description}
            </p>
            <p className="text-muted-foreground mt-1.5 text-xs sm:mt-2">
              Step {currentStepIndex + 1} of {STEPS.length}
            </p>
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            <div
              key={currentStep.id}
              className="animate-in fade-in slide-in-from-right-4 duration-300"
            >
              {currentStep.id === 'experience' && <ExperienceStep form={form} />}
              {currentStep.id === 'goals' && <GoalsStep form={form} />}
              {currentStep.id === 'bio' && <BioStep form={form} />}
            </div>
          </div>

          {/* Error Display */}
          {createProfileMutation.error && (
            <div className="bg-destructive/10 text-destructive border-destructive/20 animate-in fade-in rounded-lg border p-3 text-sm duration-200">
              <p className="font-semibold">Failed to complete setup</p>
              <p className="mt-1 text-xs">
                {createProfileMutation.error instanceof Error
                  ? createProfileMutation.error.message
                  : 'An unexpected error occurred. Please try again.'}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 border-t pt-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isFirstStep || createProfileMutation.isPending}
              type="button"
              size="sm"
            >
              <ArrowLeft size={16} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <Button
              onClick={handleNext}
              isLoading={createProfileMutation.isPending}
              type="button"
              className="min-w-[120px] rounded-xl sm:min-w-[140px]"
            >
              <span className="text-sm sm:text-base">{isLastStep ? 'Complete' : 'Next'}</span>
              {!isLastStep && <ArrowRight size={16} className="ml-1 sm:ml-2" />}
            </Button>
          </div>
        </div>
      </form.AppForm>
    </Modal>
  );
}
