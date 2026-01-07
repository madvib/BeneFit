'use client';

// ... imports
import { fitnessPlan } from '@bene/react-api-client';
import { Target, Zap, TrendingUp, LucideIcon } from 'lucide-react';
import { revalidateLogic } from '@tanstack/react-form';
import { useAppForm } from '@/lib/components/app-form';

interface GoalSelectionFormProps {
  onGenerate: (_request: fitnessPlan.GeneratePlanRequest) => void;
  isLoading?: boolean;
}

import { FITNESS_GOALS, SECONDARY_GOALS } from '@bene/shared';

const GOAL_METADATA: Record<string, { label: string; icon: LucideIcon }> = {
  strength: { label: 'Build Strength', icon: Target },
  endurance: { label: 'Improve Endurance', icon: Zap },
  hypertrophy: { label: 'Muscle Growth', icon: TrendingUp },
  weight_loss: { label: 'Weight Loss', icon: TrendingUp },
  maintenance: { label: 'Maintain Fitness', icon: Target },
  athletic_performance: { label: 'Athletic Performance', icon: Zap },
};

const SECONDARY_GOAL_LABELS: Record<string, string> = {
  consistency: 'Build Consistency',
  flexibility: 'Improve Flexibility',
  mobility: 'Enhance Mobility',
  recovery: 'Better Recovery',
  injury_prevention: 'Prevent Injuries',
};

export default function GoalSelectionForm({
  onGenerate,
  isLoading = false,
}: GoalSelectionFormProps) {
  const form = useAppForm({
    defaultValues: {
      goals: {
        primary: 'strength' as string,
        secondary: [] as string[],
        targetMetrics: {
          totalWorkouts: 12, // Default 3 workouts/week * 4 weeks
        },
      },
      customInstructions: '',
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      onGenerate({ json: value });
    },
  });

  const toggleSecondaryGoal = (
    goal: string,
    current: string[],
    handleChange: (_val: string[]) => void,
  ) => {
    if (current.includes(goal)) {
      handleChange(current.filter((g) => g !== goal));
    } else {
      handleChange([...current, goal]);
    }
  };

  return (
    <form.AppForm>
      <form.Root title="Create Your Plan" subtitle="Tell us about your goals">
        <div className="space-y-6">
          {/* Primary Goal */}
          <form.AppField name="goals.primary">
            {(field) => (
              <div>
                <h3 className="mb-4 text-lg font-semibold">What&apos;s your primary goal?</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {FITNESS_GOALS.map((goalValue) => {
                    // eslint-disable-next-line security/detect-object-injection
                    const meta = GOAL_METADATA[goalValue];
                    if (!meta) return null;
                    const Icon = meta.icon;
                    return (
                      <button
                        key={goalValue}
                        type="button"
                        onClick={() => field.handleChange(goalValue)}
                        className={`border-input flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                          field.state.value === goalValue
                            ? 'border-primary bg-primary/10'
                            : 'hover:border-primary/50'
                        }`}
                        disabled={isLoading}
                      >
                        <Icon
                          size={24}
                          className={
                            field.state.value === goalValue
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }
                        />
                        <span className="font-medium">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
                {field.state.meta.errors ? (
                  <p className="text-destructive mt-1 text-sm">
                    {field.state.meta.errors.join(', ')}
                  </p>
                ) : null}
              </div>
            )}
          </form.AppField>

          {/* Secondary Goals */}
          <form.AppField name="goals.secondary">
            {(field) => (
              <div>
                <h3 className="mb-4 text-lg font-semibold">Secondary goals (optional)</h3>
                <div className="flex flex-wrap gap-2">
                  {SECONDARY_GOALS.map((goalValue) => (
                    <button
                      key={goalValue}
                      type="button"
                      onClick={() =>
                        toggleSecondaryGoal(
                          goalValue,
                          field.state.value || [],
                          field.handleChange,
                        )
                      }
                      className={`rounded-full px-4 py-2 text-sm transition-all ${
                        field.state.value?.includes(goalValue)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-foreground hover:bg-accent/80'
                      }`}
                      disabled={isLoading}
                    >
                      {/* eslint-disable-next-line security/detect-object-injection */}
                      {SECONDARY_GOAL_LABELS[goalValue] || goalValue}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form.AppField>

          {/* Workouts Per Week */}
          <form.AppField name="goals.targetMetrics.totalWorkouts">
            {(field) => {
              const workoutsPerWeek = Math.round(field.state.value / 4);
              return (
                <div>
                  <label className="mb-2 block text-sm font-medium">Workouts per week</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={workoutsPerWeek}
                      onChange={(e) => field.handleChange(Number(e.target.value) * 4)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <span className="text-primary min-w-[3rem] text-center text-xl font-bold">
                      {workoutsPerWeek}
                    </span>
                  </div>
                </div>
              );
            }}
          </form.AppField>

          {/* Custom Instructions */}
          <form.AppField name="customInstructions">
            {(field) => (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Custom instructions (optional)
                </label>
                <textarea
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border-input bg-background w-full rounded-md border p-3 text-sm"
                  rows={4}
                  placeholder="E.g., 'Focus on upper body', 'I prefer shorter workouts', 'Avoid exercises that require equipment'..."
                  disabled={isLoading}
                />
              </div>
            )}
          </form.AppField>

          <form.SubmissionError />
          <form.SubmitButton
            label="Generate My Plan"
            submitLabel="Generating..."
            className="w-full"
            size="lg"
            isLoading={isLoading}
            disabled={!form.getFieldValue('goals.primary')}
          />
        </div>
      </form.Root>
    </form.AppForm>
  );
}
