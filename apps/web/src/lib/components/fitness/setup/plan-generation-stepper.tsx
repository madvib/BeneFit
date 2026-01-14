'use client';

import { Badge, Button, CategorizedEquipmentSelection, PrimaryGoalGrid, SecondaryGoalsList, Stepper, type StepperStep, typography } from '@/lib/components';
import { useState } from 'react';
import { Target, Dumbbell, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { useStepper } from '@/lib/hooks/use-stepper';


interface PlanGenerationStepperProps {
  onComplete: (_plan: unknown) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

const STEPS: readonly StepperStep[] = [
  {
    id: 'goals',
    title: 'Your Goals',
    icon: Target,
    description: 'What do you want to achieve?',
  },
  {
    id: 'equipment',
    title: 'Equipment',
    icon: Dumbbell,
    description: 'What equipment do you have access to?',
  },
  {
    id: 'schedule',
    title: 'Schedule',
    icon: Calendar,
    description: 'How often can you train?',
  },
] as const;

export function PlanGenerationStepper({
  onComplete,
  onSkip,
  isLoading = false,
}: PlanGenerationStepperProps) {
  const { currentStepIndex, direction, isFirstStep, isLastStep, handleNext, handleBack } =
    useStepper(STEPS.length);
  const [primaryGoal, setPrimaryGoal] = useState<string>('strength');
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(3);

  const currentStep = STEPS[currentStepIndex];

  const handleComplete = () => {
    onComplete({
      primaryGoal,
      secondaryGoals,
      equipment,
      workoutsPerWeek,
    });
  };

  if (!currentStep) return null;

  return (
    <Stepper
      steps={STEPS}
      currentStepIndex={currentStepIndex}
      direction={direction}
      size="lg"
      footer={
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={isFirstStep || isLoading}
            className="rounded-xl"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>

          <Button
            onClick={isLastStep ? handleComplete : handleNext}
            isLoading={isLoading}
            type="button"
          >
            <span className={typography.labelSm}>{isLastStep ? 'Generate' : 'Continue'}</span>
            {!isLastStep && <ArrowRight size={18} className="ml-2" />}
          </Button>
        </div>
      }
    >
      <div>
        {/* AI Badge inside content area for specialized feel */}
        <div className="mb-8 flex justify-center">
          <Badge variant="ai" className={`${typography.mutedXs} px-4 py-2 opacity-80`}>
            AI-Powered System
          </Badge>
        </div>

        {/* Goals Step */}
        {currentStep.id === 'goals' && (
          <div className="space-y-10">
            <div>
              <h3 className={`${typography.h3} mb-6`}>What is your primary goal?</h3>
              <PrimaryGoalGrid
                selected={primaryGoal}
                onChange={setPrimaryGoal}
                isLoading={isLoading}
              />
            </div>

            <div>
              <h3 className={`${typography.h3} mb-6`}>Any secondary areas of focus?</h3>
              <SecondaryGoalsList
                selected={secondaryGoals}
                onChange={setSecondaryGoals}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* Equipment Step */}
        {currentStep.id === 'equipment' && (
          <div className="space-y-6">
            <h3 className={`${typography.h3} mb-6`}>What equipment do you have?</h3>
            <CategorizedEquipmentSelection
              selected={equipment}
              onChange={setEquipment}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Schedule Step */}
        {currentStep.id === 'schedule' && (
          <div className="space-y-8 py-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className={typography.labelSm}>Workouts per Week</p>
                <div
                  className={`${typography.displayMd} bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl`}
                >
                  {workoutsPerWeek}
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={workoutsPerWeek}
                onChange={(e) => setWorkoutsPerWeek(Number(e.currentTarget.value))}
                className="accent-primary bg-muted h-2 w-full cursor-pointer appearance-none rounded-lg"
              />
            </div>

            <div className="bg-primary/5 border-primary/10 rounded-2xl border p-6">
              <div className="mb-2 flex items-center gap-3">
                <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                  <Calendar size={18} />
                </div>
                <p className={typography.p}>{workoutsPerWeek} sessions scheduled</p>
              </div>
              <p className={typography.muted}>
                Total weekly training time will be approximately{' '}
                <span className={typography.displayMd}>
                  {workoutsPerWeek * 45}-{workoutsPerWeek * 60} minutes
                </span>
                .
              </p>
            </div>
          </div>
        )}

        {/* Skip Hint */}
        {!isLoading && (
          <div className="pt-6 text-center">
            <button
              onClick={onSkip}
              className={`${typography.small} text-muted-foreground hover:text-foreground underline-offset-4 transition-all hover:underline`}
            >
              Skip and browse programs instead
            </button>
          </div>
        )}
      </div>
    </Stepper>
  );
}
