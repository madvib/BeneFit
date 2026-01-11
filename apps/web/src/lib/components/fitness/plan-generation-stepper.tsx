'use client';

import { useState } from 'react';
import { Badge, Button, Stepper, Typography, type StepperStep } from '@/lib/components';
import { Target, Dumbbell, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

import { PrimaryGoalGrid, SecondaryGoalsList } from '@/lib/components/fitness/goal-selection-ui';
import { CategorizedEquipmentSelection } from '@/lib/components/fitness/equipment-selection-ui';

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

export default function PlanGenerationStepper({
  onComplete,
  onSkip,
  isLoading = false,
}: PlanGenerationStepperProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [primaryGoal, setPrimaryGoal] = useState<string>('strength');
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(3);

  const currentStep = STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === STEPS.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete({
        primaryGoal,
        secondaryGoals,
        equipment,
        workoutsPerWeek,
      });
    } else {
      setDirection(1);
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  if (!currentStep) return null;

  return (
    <Stepper
      steps={STEPS}
      currentStepIndex={currentStepIndex}
      direction={direction}
      onClose={onSkip}
      footer={
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={isFirstStep || isLoading}
            type="button"
            className="rounded-xl"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            isLoading={isLoading}
            type="button"
            className="shadow-primary/20 min-w-[140px] rounded-xl shadow-lg"
          >
            <span className="font-bold">{isLastStep ? 'Generate' : 'Continue'}</span>
            {!isLastStep && <ArrowRight size={18} className="ml-2" />}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* AI Badge inside content area for specialized feel */}
        <div className="mb-8 flex justify-center">
          <Badge variant="ai" className="px-4 py-2 tracking-tight uppercase">
            AI-Powered System
          </Badge>
        </div>

        {/* Goals Step */}
        {currentStep.id === 'goals' && (
          <div className="space-y-10">
            <div>
              <Typography variant="h3" className="mb-6 text-xl font-black">
                What is your primary goal?
              </Typography>
              <PrimaryGoalGrid
                selected={primaryGoal}
                onChange={setPrimaryGoal}
                isLoading={isLoading}
              />
            </div>

            <div>
              <Typography variant="h3" className="mb-6 text-xl font-black">
                Any secondary areas of focus?
              </Typography>
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
            <Typography variant="h3" className="mb-6 text-xl font-black">
              What equipment do you have?
            </Typography>
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
                <Typography
                  variant="muted"
                  className="text-sm font-semibold tracking-wider uppercase"
                >
                  Workouts per Week
                </Typography>
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl text-xl font-black">
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
                <Typography className="text-foreground text-base font-bold">
                  {workoutsPerWeek} sessions scheduled
                </Typography>
              </div>
              <Typography variant="muted" className="text-sm leading-relaxed">
                Total weekly training time will be approximately{' '}
                <Typography as="span" className="text-foreground font-black">
                  {workoutsPerWeek * 45}-{workoutsPerWeek * 60} minutes
                </Typography>
                .
              </Typography>
            </div>
          </div>
        )}

        {/* Skip Hint */}
        {!isLoading && (
          <div className="pt-6 text-center">
            <button
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground text-xs font-medium underline-offset-4 transition-all hover:underline"
            >
              Skip and browse programs instead
            </button>
          </div>
        )}
      </div>
    </Stepper>
  );
}
