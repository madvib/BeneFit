'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Target, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button, Card, Stepper, Typography } from '@/lib/components';
import { useAppForm } from '@/lib/components/app-form/app-form';
import { ROUTES } from '@/lib/constants';
import { profile } from '@bene/react-api-client';

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

export default function OnboardingStepper() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
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
              availableDays: [],
              availableEquipment: [],
              maxDuration: 60,
              injuries: [],
            },
          },
        });

        router.push(ROUTES.USER.PLAN);
      } catch (error) {
        console.error('Failed to create profile', error);
      }
    },
  });

  const currentStep = STEPS[currentStepIndex];
  if (!currentStep) return null;

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      form.handleSubmit();
    } else {
      setDirection(1);
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    router.push(ROUTES.USER.ACTIVITIES);
  };

  return (
    <form.AppForm>
      <Card
        variant="default"
        className="bg-card/80 h-full rounded-none border-none shadow-none backdrop-blur-xl sm:h-auto sm:rounded-3xl sm:border sm:shadow-2xl"
        bodyClassName="p-0 h-full"
      >
        <Stepper
          steps={STEPS}
          currentStepIndex={currentStepIndex}
          direction={direction}
          onClose={handleSkip}
          footer={
            <div className="flex items-center justify-between p-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={isFirstStep || createProfileMutation.isPending}
                type="button"
                className="rounded-xl px-4 sm:px-6"
              >
                <ArrowLeft size={18} className="mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleNext}
                  isLoading={createProfileMutation.isPending}
                  type="button"
                  className="shadow-primary/20 min-w-[120px] rounded-xl px-6 font-bold shadow-lg sm:min-w-[140px] sm:px-8"
                >
                  {isLastStep ? 'Complete Setup' : 'Continue'}
                  {!isLastStep && <ArrowRight size={18} className="ml-2" />}
                </Button>
              </div>
            </div>
          }
        >
          <div className="h-full p-6 sm:p-0">
            {currentStep.id === 'experience' && <ExperienceStep form={form} />}
            {currentStep.id === 'goals' && <GoalsStep form={form} />}
            {currentStep.id === 'bio' && <BioStep form={form} />}

            {/* Error Message */}
            {createProfileMutation.error && (
              <div className="mt-8 px-6 pb-6">
                <div className="bg-destructive/10 text-destructive border-destructive/20 animate-in fade-in slide-in-from-top-2 rounded-xl border p-4 text-sm">
                  <Typography variant="large" className="font-bold">
                    Setup Error
                  </Typography>
                  <Typography variant="p" className="opacity-90">
                    {createProfileMutation.error instanceof Error
                      ? createProfileMutation.error.message
                      : 'Something went wrong. Please try again.'}
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </Stepper>
      </Card>
    </form.AppForm>
  );
}
