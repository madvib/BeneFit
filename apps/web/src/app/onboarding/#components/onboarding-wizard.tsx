'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { profile } from '@bene/react-api-client';
import { Button, Card } from '@/lib/components';
import { useAppForm } from '@/lib/components/app-form/app-form';
import { ROUTES } from '@/lib/constants';
import { User, Activity, Target, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { VALID_DAYS } from '@bene/shared';

import { BioStep } from './bio-step';
import { ExperienceStep } from './experience-step';
import { GoalsStep } from './goals-step';
import { ConstraintsStep } from './constraints-step';

import { onboardingFormOpts } from './form-options';

// Steps definition
const STEPS = [
  { id: 'bio', title: 'About You', icon: User },
  { id: 'experience', title: 'Experience', icon: Activity },
  { id: 'goals', title: 'Fitness Goals', icon: Target },
  { id: 'constraints', title: 'Availability', icon: Calendar },
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
            trainingConstraints: {
              location: 'mixed',
              availableDays: VALID_DAYS.slice(0, value.daysPerWeek), // Map number to DayName
              availableEquipment: value.equipment,
              maxDuration: value.minutesPerWorkout,
              injuries: [],
            },
          },
        });

        // Redirect to Plan generation or Dashboard
        router.push(ROUTES.USER.PLAN);
      } catch (error) {
        console.error('Failed to create profile', error);
      }
    },
  });

  const currentStep = STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === STEPS.length - 1;

  if (!currentStep) return null;

  const validateCurrentStep = async () => {
    // Validate fields for the current step
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

  return (
    <form.AppForm>
      <div className="w-full max-w-xl space-y-8">
        {/* Progress Bar */}
        <div className="bg-secondary relative h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full">
            <currentStep.icon size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{currentStep.title}</h1>
          <p className="text-muted-foreground mt-2">
            step {currentStepIndex + 1} of {STEPS.length}
          </p>
        </div>

        {/* Step Content */}
        <Card className="p-6">
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {currentStep.id === 'bio' && <BioStep form={form} />}
            {currentStep.id === 'experience' && <ExperienceStep form={form} />}
            {currentStep.id === 'goals' && <GoalsStep form={form} />}
            {currentStep.id === 'constraints' && <ConstraintsStep form={form} />}
          </div>
        </Card>

        {/* Error Display */}
        {createProfileMutation.error && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-4">
            <p className="font-semibold">Failed to complete setup</p>
            <p className="mt-1 text-sm">
              {createProfileMutation.error instanceof Error
                ? createProfileMutation.error.message
                : 'An unexpected error occurred. Please try again.'}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStepIndex === 0 || createProfileMutation.isPending}
            type="button"
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </Button>
          <Button
            onClick={handleNext}
            isLoading={createProfileMutation.isPending}
            type="button" // Use type="button" to prevent default submit except on last step handled explicitly
          >
            {isLastStep ? 'Complete Setup' : 'Next Step'}
            {!isLastStep && <ArrowRight size={18} className="ml-2" />}
          </Button>
        </div>
      </div>
    </form.AppForm>
  );
}
