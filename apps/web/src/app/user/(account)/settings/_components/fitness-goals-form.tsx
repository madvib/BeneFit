'use client';
import { revalidateLogic } from '@tanstack/react-form';
import { useAppForm } from '@/lib/components/app-form';
import { UpdateFitnessGoalsFormSchema } from '@bene/shared';
import { SecondaryGoalsList, PrimaryGoalGrid } from '@/lib/components/fitness/goal-selection-ui';

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
      onDynamic: UpdateFitnessGoalsFormSchema,
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

          {/* Secondary Goals Field */}
          <form.AppField name="secondary">
            {(field) => (
              <div>
                <label className="mb-3 block text-base font-medium">Secondary Goals</label>
                <SecondaryGoalsList
                  selected={field.state.value || []}
                  onChange={field.handleChange}
                  isLoading={isLoading}
                />
              </div>
            )}
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
