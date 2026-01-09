'use client';

import { useState } from 'react';
import { revalidateLogic } from '@tanstack/react-form';
import { Calendar, Clock, Dumbbell, AlertTriangle } from 'lucide-react';
import { UpdateTrainingConstraintsFormSchema } from '@bene/shared';
import { useAppForm } from '@/lib/components/app-form';
import { Button, Input } from '@/lib/components';

const EQUIPMENT_OPTIONS =
  UpdateTrainingConstraintsFormSchema.shape.availableEquipment.element.options;

interface TrainingConstraintsFormProps {
  initialConstraints: {
    availableDays: string[];
    availableEquipment: string[];
    maxDuration: number;
    injuries: string[];
  };
  onSave: (_constraints: unknown) => Promise<void>;
  isLoading?: boolean;
}

export function TrainingConstraintsForm({
  initialConstraints,
  onSave,
  isLoading,
}: TrainingConstraintsFormProps) {
  const form = useAppForm({
    defaultValues: {
      availableDays: initialConstraints.availableDays || [],
      availableEquipment: initialConstraints.availableEquipment || [],
      maxDuration: initialConstraints.maxDuration || 45,
      injuries: (initialConstraints.injuries || []).map((inj) => ({
        description: inj,
        bodyPart: 'General',
        severity: 'minor' as const,
      })),
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      await onSave(value);
    },
  });

  // Local state for injury input helper
  const [injuryInput, setInjuryInput] = useState('');

  return (
    <form.AppForm>
      <form.Root
        title="Training Constraints"
        subtitle="Set your schedule, available equipment, and limitations."
      >
        <div className="space-y-8">
          {/* Frequency (Days) */}
          <form.AppField name="availableDays">
            {(field) => {
              const currentDays = field.state.value || [];
              const daysCount = currentDays.length;
              const handleDaysChange = (count: number) => {
                const WEEK_DAYS = [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ];
                field.handleChange(WEEK_DAYS.slice(0, count));
              };

              return (
                <div>
                  <label className="mb-3 flex items-center gap-2 text-base font-medium">
                    <Calendar size={18} /> Training Frequency
                  </label>
                  <div className="bg-accent/20 flex items-center gap-4 rounded-lg border p-4">
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={daysCount || 3}
                      onChange={(e) => handleDaysChange(Number(e.target.value))}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <span className="font-semibold">{daysCount} days / week</span>
                  </div>
                  {field.state.meta.errors ? (
                    <p className="text-destructive mt-1 text-sm">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  ) : null}
                </div>
              );
            }}
          </form.AppField>

          {/* Duration */}
          <form.AppField name="maxDuration">
            {(field) => (
              <div>
                <label className="mb-3 flex items-center gap-2 text-base font-medium">
                  <Clock size={18} /> Max Workout Duration
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => field.handleChange(mins)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        field.state.value === mins
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'hover:border-primary/50'
                      }`}
                      disabled={isLoading}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
                {field.state.meta.errors ? (
                  <p className="text-destructive mt-1 text-sm">
                    {field.state.meta.errors.join(', ')}
                  </p>
                ) : null}
              </div>
            )}
          </form.AppField>

          {/* Equipment */}
          <form.AppField name="availableEquipment">
            {(field) => {
              const currentEquipment = field.state.value || [];
              const toggleEquipment = (id: string) => {
                const newValue = currentEquipment.includes(id)
                  ? currentEquipment.filter((e) => e !== id)
                  : [...currentEquipment, id];
                field.handleChange(newValue);
              };

              return (
                <div>
                  <label className="mb-3 flex items-center gap-2 text-base font-medium">
                    <Dumbbell size={18} /> Available Equipment
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {EQUIPMENT_OPTIONS.map((item) => {
                      const id = item; // Value is explicitly the ID in our schema
                      const isSelected = currentEquipment.includes(id);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleEquipment(item)}
                          className={`rounded-md border px-3 py-2 text-left text-sm transition-all ${
                            isSelected ? 'border-primary bg-primary/10' : 'hover:bg-accent'
                          }`}
                          disabled={isLoading}
                        >
                          <div className="flex items-center justify-between">
                            {item}
                            {isSelected && <div className="bg-primary h-2 w-2 rounded-full" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }}
          </form.AppField>

          {/* Injuries */}
          <form.AppField name="injuries">
            {(field) => {
              const currentInjuries = field.state.value || [];
              const addInjury = () => {
                if (injuryInput.trim()) {
                  // Schema expects objects: { bodyPart: string, severity: string, description: string }
                  // We map user input to 'description' and provide defaults for others
                  field.handleChange([
                    ...currentInjuries,
                    {
                      description: injuryInput.trim(),
                      bodyPart: 'General',
                      severity: 'minor',
                    },
                  ]);
                  setInjuryInput('');
                }
              };
              const removeInjury = (index: number) => {
                field.handleChange(currentInjuries.filter((_, i) => i !== index));
              };

              return (
                <div>
                  <label className="mb-3 flex items-center gap-2 text-base font-medium">
                    <AlertTriangle size={18} /> Injuries & Limitations
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an injury (e.g., Lower back pain)"
                        value={injuryInput}
                        onChange={(e) => setInjuryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault(); // Prevent form submit
                            addInjury();
                          }
                        }}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addInjury}
                        disabled={!injuryInput || isLoading}
                      >
                        Add
                      </Button>
                    </div>

                    {currentInjuries.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentInjuries.map((injury, idx: number) => (
                          <span
                            key={idx}
                            className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-full px-3 py-1 text-sm"
                            title={`${injury.severity} - ${injury.bodyPart}`}
                          >
                            {injury.description}
                            <button
                              type="button"
                              onClick={() => removeInjury(idx)}
                              className="hover:text-destructive/80 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {currentInjuries.length === 0 && (
                      <p className="text-muted-foreground text-sm italic">
                        No injuries reported.
                      </p>
                    )}
                  </div>
                </div>
              );
            }}
          </form.AppField>

          <form.SubmissionError />
          <div className="flex justify-end pt-4">
            <form.SubmitButton label="Save Constraints" submitLabel="Saving..." />
          </div>
        </div>
      </form.Root>
    </form.AppForm>
  );
}
