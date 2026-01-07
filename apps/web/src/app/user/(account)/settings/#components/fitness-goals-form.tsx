'use client';
import { revalidateLogic } from '@tanstack/react-form';
import { useAppForm } from '@/lib/components/app-form';
import { profileSchemas } from '@bene/react-api-client';

import { Target, Zap, TrendingUp, type LucideIcon } from 'lucide-react';
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

interface FitnessGoalsFormProps {
  initialPrimary: string;
  initialSecondary: string[];
  onSave: (_goals: { primary: string; secondary: string[] }) => Promise<void>;
  isLoading?: boolean;
}
export function FitnessGoalsForm({
  initialPrimary,
  initialSecondary,
  onSave,
  isLoading,
}: FitnessGoalsFormProps) {
  const form = useAppForm({
    defaultValues: {
      primary: initialPrimary || 'strength',
      secondary: initialSecondary || [],
    },
    validators: {
      onDynamic: profileSchemas.UpdateFitnessGoalsSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      await onSave(value);
    },
  });

  return (
    <form.AppForm>
      <form.Root title="Fitness Goals" subtitle="Update your training focus and objectives.">
        <div className="space-y-6">
          {/* Primary Goal Field */}
          <form.AppField name="primary">
            {(field) => (
              <div>
                <label className="mb-3 block text-base font-medium">Primary Goal</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {FITNESS_GOALS.map((goalValue) => {
                    // eslint-disable-next-line security/detect-object-injection
                    const meta = GOAL_METADATA[goalValue];
                    if (!meta) return null;
                    const Icon = meta.icon;
                    const isSelected = field.state.value === goalValue;
                    return (
                      <button
                        key={goalValue}
                        type="button"
                        onClick={() => {
                          field.handleChange(goalValue);
                        }}
                        className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                          isSelected ? 'border-primary bg-primary/10' : 'hover:border-primary/50'
                        }`}
                        disabled={isLoading}
                      >
                        <Icon
                          size={20}
                          className={isSelected ? 'text-primary' : 'text-muted-foreground'}
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

          {/* Secondary Goals Field */}
          <form.AppField name="secondary">
            {(field) => {
              const currentValues = field.state.value || [];
              const toggleGoal = (val: string) => {
                const newValues = currentValues.includes(val)
                  ? currentValues.filter((v) => v !== val)
                  : [...currentValues, val];
                field.handleChange(newValues);
              };

              return (
                <div>
                  <label className="mb-3 block text-base font-medium">Secondary Goals</label>
                  <div className="flex flex-wrap gap-2">
                    {SECONDARY_GOALS.map((goalValue) => (
                      <button
                        key={goalValue}
                        type="button"
                        onClick={() => toggleGoal(goalValue)}
                        className={`rounded-full px-4 py-2 text-sm transition-all ${
                          currentValues.includes(goalValue)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent text-foreground hover:bg-accent/80'
                        }`}
                        disabled={isLoading}
                      >
                        {
                          // eslint-disable-next-line security/detect-object-injection
                          SECONDARY_GOAL_LABELS[goalValue] || goalValue
                        }
                      </button>
                    ))}
                  </div>
                </div>
              );
            }}
          </form.AppField>
        </div>

        <form.SubmissionError />
        <div className="flex justify-end pt-4">
          <form.SubmitButton label="Save Goals" submitLabel="Saving..." />
        </div>
      </form.Root>
    </form.AppForm>
  );
}
