import { Target, Settings, Wand2, UserRoundPlus, ArrowRight, ArrowLeft } from 'lucide-react';
import { GeneratePlanRequest, useSession } from '@bene/react-api-client';
import { useStepper } from '@/lib/hooks/use-stepper';
import { Button, SignupForm, Stepper, typography, useAppForm } from '@/lib/components';
import { planGenerationFormOpts } from './form-options';
import { PlanGoalsStep } from './goals-step';
import { PlanTrainingStep } from './training-step';
import { PlanCustomizeStep } from './customize-step';

const STEPS = [
  { id: 'goals', title: 'Goals', icon: Target, description: 'What do you want to achieve?' },
  { id: 'training', title: 'Training', icon: Settings, description: 'Schedule and equipment' },
  { id: 'customize', title: 'Customize', icon: Wand2, description: 'Final touches' },
  { id: 'signup', title: 'Account', icon: UserRoundPlus, description: 'Create an account' },
] as const;

interface PlanGenerationStepperProps {
  onGenerate: (_request: GeneratePlanRequest) => void;
  isLoading?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function PlanGenerationStepper({
  onGenerate,
  isLoading = false,
  isOpen,
}: Readonly<PlanGenerationStepperProps>) {
  const { isAuthenticated } = useSession();
  const totalSteps = isAuthenticated ? STEPS.length - 1 : STEPS.length; // Hide signup step if authenticated
  const { currentStepIndex, direction, isFirstStep, isLastStep, handleNext, handleBack } =
    useStepper(totalSteps);

  const form = useAppForm({
    ...planGenerationFormOpts,
    onSubmit: async ({ value }) => {
      onGenerate({
        json: value,
      });
    },
  });

  // For authenticated users, we exclude the signup step
  const displayedSteps = isAuthenticated ? STEPS.slice(0, -1) : STEPS;
  const currentStep = displayedSteps[currentStepIndex];

  if (!currentStep) return null;

  // Determine if we're on the signup step (which only appears for non-authenticated users)
  const isOnSignupStep = !isAuthenticated && currentStep.id === 'signup';
  // Check if we're on the actual last step for the authenticated user flow
  const isOnLastStepForAuthenticated =
    isAuthenticated && currentStepIndex === displayedSteps.length - 1;

  return (
    <form.AppForm>
      <Stepper
        size="lg"
        steps={displayedSteps} // Only show signup step to non-authenticated users
        currentStepIndex={currentStepIndex}
        direction={direction}
        isOpen={isOpen}
        footer={
          <div className="flex w-full items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isFirstStep || isLoading}
              type="button"
              className="rounded-xl px-6"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Button>

            {isOnSignupStep ? (
              <Button
                onClick={handleNext} // After signup, user should be authenticated and can continue
                isLoading={isLoading}
                type="button"
                className={`${typography.p} shadow-primary/20 min-w-40 rounded-xl px-8 shadow-lg`}
              >
                Continue to Plan
              </Button>
            ) : (
              <Button
                onClick={isOnLastStepForAuthenticated ? form.handleSubmit : handleNext}
                isLoading={isLoading}
                type="button"
                className="shadow-primary/20 min-w-30 rounded-xl px-6 shadow-lg sm:min-w-35 sm:px-8"
              >
                {isOnLastStepForAuthenticated ? 'Generate My Plan' : 'Continue'}
                {!isOnLastStepForAuthenticated && <ArrowRight size={18} className="ml-2" />}
              </Button>
            )}
          </div>
        }
      >
        <div className="h-full">
          {currentStep.id === 'goals' && !isOnSignupStep && <PlanGoalsStep form={form} />}
          {currentStep.id === 'training' && !isOnSignupStep && <PlanTrainingStep form={form} />}
          {currentStep.id === 'customize' && !isOnSignupStep && <PlanCustomizeStep form={form} />}
          {isOnSignupStep && (
            <div className="p-6">
              <h2 className={`${typography.h3} mb-2`}>Create Your Account</h2>
              <p className={`${typography.muted} mb-6`}>
                Sign up to save your personalized fitness plan
              </p>

              <SignupForm
                onSuccess={() => {
                  // After successful signup, proceed to next step (which would be generating the plan)
                  handleNext();
                }}
              />
            </div>
          )}
        </div>
      </Stepper>
    </form.AppForm>
  );
}
