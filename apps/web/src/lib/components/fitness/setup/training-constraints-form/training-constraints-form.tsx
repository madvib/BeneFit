

import { type UpdateTrainingConstraintsFormValues } from '@bene/react-api-client';
import { useAppForm } from '@/lib/components';

import { FrequencySection } from './sections/frequency-section';
import { DurationSection } from './sections/duration-section';
import { EquipmentSection } from './sections/equipment-section';
import { InjurySection } from './sections/injury-section';
import { trainingConstraintsFormOptions } from './form-options';

interface TrainingConstraintsFormProps {
  initialConstraints: UpdateTrainingConstraintsFormValues;
  onSave: (_constraints: UpdateTrainingConstraintsFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function TrainingConstraintsForm({
  initialConstraints,
  onSave,
}: Readonly<TrainingConstraintsFormProps>) {
  const form = useAppForm({
    ...trainingConstraintsFormOptions,
    defaultValues: {
      ...initialConstraints,
    },
    onSubmit: async ({ value }) => {
      await onSave(value);
    },
  });

  return (
    <form.AppForm>
      <form.Root
        title="Training Constraints"
        subtitle="Set your schedule, available equipment, and physical limitations. This helps us tailor your workouts to your environment and body."
      >
        <div className="space-y-12">
          {/* Schedule & Timing Group */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            <FrequencySection form={form} />
            <DurationSection form={form} />
          </div>

          <hr className="border-border/30" />

          {/* Environment & Equipment Group */}
          <EquipmentSection form={form} />

          <hr className="border-border/30" />

          {/* Physical State Group */}
          <InjurySection form={form} />

          <form.SubmissionError />
          
          <div className="flex justify-end border-t border-border/30 pt-8">
            <form.SubmitButton 
              label="Update Constraints" 
              submitLabel="Saving changes..." 
              className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
            />
          </div>
        </div>
      </form.Root>
    </form.AppForm>
  );
}
