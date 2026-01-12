import { useState } from 'react';
import { Target, Settings, Wand2, ArrowRight, ArrowLeft } from 'lucide-react';
import { fitnessPlan } from '@bene/react-api-client';
import { revalidateLogic } from '@tanstack/react-form';
import { useAppForm } from '@/lib/components/app-form';
import { Button, Stepper, typography } from '@/lib/components';
import { PrimaryGoalGrid, SecondaryGoalsList } from '@/lib/components/fitness/goal-selection-ui';
import { CategorizedEquipmentSelection } from '@/lib/components/fitness/equipment-selection-ui';

interface GoalSelectionFormProps {
  onGenerate: (_request: fitnessPlan.GeneratePlanRequest) => void;
  isLoading?: boolean;
}

const STEPS = [
  { id: 'goals', title: 'Goals', icon: Target, description: 'What do you want to achieve?' },
  { id: 'training', title: 'Training', icon: Settings, description: 'Schedule and equipment' },
  { id: 'customize', title: 'Customize', icon: Wand2, description: 'Final touches' },
] as const;

export default function GoalSelectionForm({
  onGenerate,
  isLoading = false,
}: GoalSelectionFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const form = useAppForm({
    defaultValues: {
      goals: {
        primary: 'strength' as string,
        secondary: [] as string[],
        targetMetrics: {
          totalWorkouts: 12, // 3 per week * 4 weeks
        },
      },
      availableEquipment: [] as string[],
      customInstructions: '',
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      onGenerate({
        json: {
          goals: value.goals,
          customInstructions: value.customInstructions,
        },
      });
    },
  });

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setDirection(1);
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      form.handleSubmit();
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const currentStep = STEPS[currentStepIndex];
  if (!currentStep) return null;

  return (
    <form.AppForm>
      <Stepper
        steps={STEPS}
        currentStepIndex={currentStepIndex}
        direction={direction}
        onClose={() => {}} // GoalSelectionForm is inline, not in a modal and doesn't have a close action in this context
        footer={
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStepIndex === 0 || isLoading}
              type="button"
              className="rounded-xl px-6"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              isLoading={isLoading}
              type="button"
              className={`${typography.labelSm} shadow-primary/20 min-w-[160px] rounded-xl px-8 shadow-lg`}
            >
              <span>{currentStepIndex === STEPS.length - 1 ? 'Generate Plan' : 'Continue'}</span>
              {currentStepIndex !== STEPS.length - 1 && <ArrowRight size={18} className="ml-2" />}
            </Button>
          </div>
        }
      >
        <div className="h-full">
          {currentStep.id === 'goals' && (
            <div className="h-full space-y-8">
              <form.AppField name="goals.primary">
                {(field) => (
                  <div className="space-y-4">
                    <label className={`${typography.large} font-bold`}>
                      What&apos;s your primary goal?
                    </label>
                    <PrimaryGoalGrid
                      selected={field.state.value}
                      onChange={field.handleChange}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </form.AppField>

              <form.AppField name="goals.secondary">
                {(field) => (
                  <div className="space-y-4">
                    <label className={`${typography.large} font-bold`}>
                      Secondary goals (optional)
                    </label>
                    <SecondaryGoalsList
                      selected={field.state.value || []}
                      onChange={field.handleChange}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </form.AppField>
            </div>
          )}

          {currentStep.id === 'training' && (
            <div className="h-full space-y-8">
              <form.AppField name="goals.targetMetrics.totalWorkouts">
                {(field) => {
                  const workoutsPerWeek = Math.round(field.state.value / 4);
                  return (
                    <div className="space-y-4">
                      <label className={`${typography.large} font-bold`}>Workouts per week</label>
                      <div className="bg-accent/10 flex flex-col items-center gap-4 rounded-3xl border p-5 sm:flex-row sm:gap-6 sm:p-8">
                        <input
                          type="range"
                          min="1"
                          max="7"
                          value={workoutsPerWeek}
                          onChange={(e) => field.handleChange(Number(e.target.value) * 4)}
                          className="accent-primary bg-muted h-2 w-full cursor-pointer appearance-none rounded-lg"
                          disabled={isLoading}
                        />
                        <div
                          className={`${typography.displayXs} bg-primary text-primary-foreground flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg`}
                        >
                          {workoutsPerWeek}
                        </div>
                      </div>
                    </div>
                  );
                }}
              </form.AppField>

              <form.AppField name="availableEquipment">
                {(field) => (
                  <div className="space-y-4">
                    <label className={`${typography.large} font-bold`}>Available Equipment</label>
                    <CategorizedEquipmentSelection
                      selected={field.state.value || []}
                      onChange={field.handleChange}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </form.AppField>
            </div>
          )}

          {currentStep.id === 'customize' && (
            <div className="h-full space-y-8">
              <form.AppField name="customInstructions">
                {(field) => (
                  <div className="space-y-4">
                    <label className={`${typography.large} font-bold`}>
                      Custom instructions (optional)
                    </label>
                    <div className="relative">
                      <textarea
                        value={field.state.value || ''}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={`${typography.small} border-input bg-background/50 focus:bg-background focus:ring-primary/20 h-40 w-full rounded-2xl border p-5 transition-all outline-none focus:ring-2`}
                        placeholder="E.g., 'Focus on upper body', 'I prefer shorter workouts', 'I have a sensitive shoulder'..."
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
              </form.AppField>
              <form.SubmissionError />
            </div>
          )}
        </div>
      </Stepper>
    </form.AppForm>
  );
}
