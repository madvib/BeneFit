'use client';

import { Share2, ThumbsUp } from 'lucide-react';
import { revalidateLogic } from '@tanstack/react-form';
import { useAppForm } from '@/lib/components/app-form';
import type { DailyWorkout } from '@bene/shared';

export interface PerformanceFormData {
  performance: {
    perceivedExertion: number;
    durationMinutes: number;
    notes: string;
  };
  shareToFeed: boolean;
}

interface PerformanceFormProps {
  workout: DailyWorkout;
  onSubmit: (_data: PerformanceFormData) => void;
  isLoading: boolean;
}

export default function PerformanceForm({ workout, onSubmit, isLoading }: PerformanceFormProps) {
  const form = useAppForm({
    defaultValues: {
      performance: {
        perceivedExertion: 5,
        durationMinutes: workout?.durationMinutes || 30,
        notes: '',
      },
      shareToFeed: true,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  const getRpeLabel = (val: number) => {
    if (val <= 2) return 'Very Easy';
    if (val <= 4) return 'Easy';
    if (val <= 6) return 'Moderate';
    if (val <= 8) return 'Hard';
    return 'Max Effort';
  };

  return (
    <form.AppForm>
      <form.Root title="Workout Complete" subtitle="Great job! How did it feel?">
        <div className="space-y-6">
          <form.AppField name="performance.perceivedExertion">
            {(field) => (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Intensity (RPE)</h3>
                  <span className="text-primary text-lg font-bold">
                    {field.state.value} - {getRpeLabel(field.state.value)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="bg-secondary accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg"
                  disabled={isLoading}
                />
                <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                  <span>Light</span>
                  <span>Moderate</span>
                  <span>Max Effort</span>
                </div>
              </div>
            )}
          </form.AppField>

          <form.AppField name="performance.notes">
            {(field) => (
              <div>
                <label className="mb-2 block text-sm font-medium">Notes & Feedback</label>
                <textarea
                  className="bg-background border-input min-h-[100px] w-full rounded-md border p-3 text-sm"
                  placeholder="How was your form? Any pain? Great pump?"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}
          </form.AppField>

          <form.AppField name="shareToFeed">
            {(field) => (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => field.handleChange(!field.state.value)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-colors ${
                    field.state.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input text-muted-foreground hover:bg-accent'
                  }`}
                  disabled={isLoading}
                >
                  <Share2 size={16} />
                  Share to Feed
                </button>
              </div>
            )}
          </form.AppField>
        </div>

        <form.SubmissionError />
        <div className="pt-4">
          <form.SubmitButton
            label="Finish Workout"
            submitLabel="Saving..."
            className="w-full"
            size="lg"
          >
            <ThumbsUp size={18} className="mr-2" />
            Finish Workout
          </form.SubmitButton>
        </div>
      </form.Root>
    </form.AppForm>
  );
}
