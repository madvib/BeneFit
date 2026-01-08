'use client';

// ... imports
import { fitnessPlan } from '@bene/react-api-client';
import { revalidateLogic } from '@tanstack/react-form';
import { useAppForm } from '@/lib/components/app-form';

interface GoalSelectionFormProps {
  onGenerate: (_request: fitnessPlan.GeneratePlanRequest) => void;
  isLoading?: boolean;
}

import { PrimaryGoalGrid, SecondaryGoalsList } from '../../../_shared/goals/goal-selection-ui';

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

  return (
    <form.AppForm>
      <form.Root title="Create Your Plan" subtitle="Tell us about your goals">
        <div className="space-y-6">
          {/* Primary Goal */}
          <form.AppField name="goals.primary">
            {(field) => (
              <div>
                <h3 className="mb-4 text-lg font-semibold">What&apos;s your primary goal?</h3>
                <PrimaryGoalGrid
                  selected={field.state.value}
                  onChange={field.handleChange}
                  isLoading={isLoading}
                />
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
                <SecondaryGoalsList
                  selected={field.state.value || []}
                  onChange={field.handleChange}
                  isLoading={isLoading}
                />
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
