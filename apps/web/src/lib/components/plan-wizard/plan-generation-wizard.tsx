'use client';

import { useState } from 'react';
import { profileSchemas } from '@bene/react-api-client';
import { Button } from '@/lib/components/ui-primitives';
import { Modal } from '@/lib/components/ui-primitives/modal/modal';
import { Target, Dumbbell, Calendar, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { FITNESS_GOALS, SECONDARY_GOALS } from '@bene/shared';

interface PlanGenerationWizardProps {
  onComplete: (_plan: unknown) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

const STEPS = [
  { id: 'goals', title: 'Your Goals', icon: Target, description: 'What do you want to achieve?' },
  {
    id: 'equipment',
    title: 'Equipment',
    icon: Dumbbell,
    description: 'What equipment do you have access to?',
  },
  { id: 'schedule', title: 'Schedule', icon: Calendar, description: 'How often can you train?' },
] as const;

const EQUIPMENT_OPTIONS =
  profileSchemas.UpdateTrainingConstraintsSchema.shape.availableEquipment.element.options;

export default function PlanGenerationWizard({
  onComplete,
  onSkip,
  isLoading = false,
}: PlanGenerationWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [primaryGoal, setPrimaryGoal] = useState<string>('strength');
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(3);

  const currentStep = STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === STEPS.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (isLastStep) {
      // TODO: Call API to generate plan
      onComplete({
        primaryGoal,
        secondaryGoals,
        equipment,
        workoutsPerWeek,
      });
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const toggleSecondaryGoal = (goal: string) => {
    setSecondaryGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  };

  const toggleEquipment = (eq: string) => {
    setEquipment((prev) => (prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]));
  };

  if (!currentStep) return null;

  return (
    <Modal onClose={onSkip}>
      <div className="space-y-6 p-6 sm:p-8">
        {/* Header Badge */}
        <div className="text-center">
          <div className="bg-background border-muted mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-sm sm:px-4 sm:py-1.5 sm:text-sm">
            <Sparkles size={14} className="text-primary animate-pulse sm:size-4" />
            <span className="text-foreground">AI-Powered</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="text-muted-foreground flex justify-between text-[10px] font-medium tracking-wider uppercase sm:text-xs">
            <span>Start</span>
            <span>Generate</span>
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
        <div className="min-h-[250px]">
          <div
            key={currentStep.id}
            className="animate-in fade-in slide-in-from-right-4 space-y-5 duration-300"
          >
            {/* Goals Step */}
            {currentStep.id === 'goals' && (
              <>
                <div>
                  <h3 className="mb-3 text-sm font-semibold sm:text-base">Primary Goal</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {FITNESS_GOALS.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setPrimaryGoal(goal)}
                        className={`rounded-lg border p-3 text-sm font-medium capitalize transition-all ${
                          primaryGoal === goal
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'hover:border-primary/50'
                        }`}
                      >
                        {goal.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold sm:text-base">
                    Secondary Goals (optional)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SECONDARY_GOALS.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleSecondaryGoal(goal)}
                        className={`rounded-full px-3 py-1.5 text-xs transition-all sm:text-sm ${
                          secondaryGoals.includes(goal)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent text-foreground hover:bg-accent/80'
                        }`}
                      >
                        {goal.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Equipment Step */}
            {currentStep.id === 'equipment' && (
              <div>
                <h3 className="mb-3 text-sm font-semibold sm:text-base">
                  Select Available Equipment
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {EQUIPMENT_OPTIONS.map((eq) => (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => toggleEquipment(eq)}
                      className={`rounded-lg border p-3 text-sm capitalize transition-all ${
                        equipment.includes(eq)
                          ? 'bg-primary/10 border-primary'
                          : 'hover:border-primary/50'
                      }`}
                    >
                      {eq.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <p className="text-muted-foreground mt-3 text-xs">
                  Select all that apply. We&apos;ll design workouts around what you have.
                </p>
              </div>
            )}

            {/* Schedule Step */}
            {currentStep.id === 'schedule' && (
              <div>
                <h3 className="mb-4 text-sm font-semibold sm:text-base">Workouts per Week</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={workoutsPerWeek}
                      onChange={(e) => setWorkoutsPerWeek(Number(e.currentTarget.value))}
                      className="flex-1"
                    />
                    <span className="text-primary min-w-[3rem] text-center text-3xl font-bold">
                      {workoutsPerWeek}
                    </span>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4">
                    <p className="text-foreground text-sm font-medium">
                      {workoutsPerWeek} workouts per week
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      ~{workoutsPerWeek * 45}-{workoutsPerWeek * 60} minutes total per week
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 border-t pt-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={isFirstStep || isLoading}
            type="button"
            size="sm"
          >
            <ArrowLeft size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <button
            onClick={onSkip}
            disabled={isLoading}
            type="button"
            className="text-muted-foreground hover:text-foreground text-xs underline transition-colors sm:text-sm"
          >
            Skip
          </button>

          <Button
            onClick={handleNext}
            isLoading={isLoading}
            type="button"
            className="min-w-[100px] rounded-xl sm:min-w-[120px]"
          >
            <span className="text-sm sm:text-base">{isLastStep ? 'Generate' : 'Next'}</span>
            {!isLastStep && <ArrowRight size={16} className="ml-1 sm:ml-2" />}
          </Button>
        </div>

        {/* Hint */}
        <p className="text-muted-foreground text-center text-xs">💡 Click outside to skip</p>
      </div>
    </Modal>
  );
}
