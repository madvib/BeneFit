'use client';

import { Share2, ThumbsUp, PenLine, Heart } from 'lucide-react';
import { revalidateLogic } from '@tanstack/react-form';
import type { DailyWorkout } from '@bene/react-api-client';
import { Button, RPEPicker, typography, useAppForm } from '@/lib/components';

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

// TODO need a validator, replace PerformanceFormData with shared schema.
export function PerformanceForm({ workout, onSubmit, isLoading }: Readonly<PerformanceFormProps>) {
  const form = useAppForm({
    defaultValues: {
      performance: {
        perceivedExertion: 5,
        durationMinutes: workout?.estimatedDuration || 30,
        notes: '',
      },
      shareToFeed: true,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <div className="bg-background relative overflow-hidden">
      <form.AppForm>
        <form.Root
          title="Session Debrief"
          subtitle="Data collection complete. Log your subjective performance indices."
          variant="ghost"
        >
          <div className="space-y-10">
            {/* RPE Selector */}
            <form.AppField name="performance.perceivedExertion">
              {(field) => (
                <RPEPicker
                  value={field.state.value}
                  onChange={field.handleChange}
                  disabled={isLoading}
                />
              )}
            </form.AppField>

            {/* Notes Section */}
            <form.AppField name="performance.notes">
              {(field) => (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <PenLine size={18} className="text-primary" />
                    <h4 className={typography.small}>Coach Transcription</h4>
                  </div>
                  <div className="group relative">
                    <textarea
                      className={`${typography.small} bg-accent/20 border-border/50 focus:border-primary/50 focus:ring-primary/5 placeholder:text-muted-foreground/30 no-scrollbar min-h-30 w-full rounded-2xl border p-5 leading-relaxed transition-all focus:ring-4`}
                      placeholder="Input physiological feedback, form observations, or cognitive state during peak loads..."
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
                    {/* TODO can this be an IconBox? */}
                    <div className="text-primary/20 group-focus-within:text-primary/50 absolute right-4 bottom-4 transition-colors">
                      <Heart size={16} />
                    </div>
                  </div>
                </div>
              )}
            </form.AppField>

            {/* Social Integration */}
            <form.AppField name="shareToFeed">
              {(field) => (
                <div className="bg-primary/5 border-primary/10 flex flex-col items-center justify-between gap-4 rounded-2xl border p-6 sm:flex-row">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/20 text-primary rounded-xl p-3">
                      <Share2 size={20} />
                    </div>
                    <div>
                      <p className={typography.displayBase}>Sync to Achievement Feed</p>
                      <p className={typography.displaySm}>
                        Transmit this session data to your network.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={field.state.value ? 'default' : 'outline'}
                    onClick={() => field.handleChange(!field.state.value)}
                    className={`${typography.labelXs} rounded-xl px-6 transition-all ${field.state.value ? 'shadow-primary/20 scale-105 shadow-lg' : 'border-border hover:bg-accent/40 bg-transparent'}`}
                    disabled={isLoading}
                  >
                    {field.state.value ? 'Broadcast On' : 'Broadcast Off'}
                  </Button>
                </div>
              )}
            </form.AppField>
          </div>

          <form.SubmissionError />

          <div className="pt-12">
            <Button
              type="submit"
              className={`${typography.p} bg-primary text-primary-foreground shadow-primary/30 group h-16 w-full rounded-3xl italic shadow-2xl transition-all hover:scale-[1.02] active:scale-95`}
              disabled={isLoading}
              size="lg"
            >
              <ThumbsUp size={20} className="mr-3 transition-transform group-hover:rotate-12" />
              {isLoading ? 'Processing Protocol...' : 'Finalize Session'}
            </Button>
          </div>
        </form.Root>
      </form.AppForm>
    </div>
  );
}
