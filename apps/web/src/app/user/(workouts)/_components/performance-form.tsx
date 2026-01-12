'use client';

import { Share2, ThumbsUp, Activity, PenLine, Heart } from 'lucide-react';
import { revalidateLogic } from '@tanstack/react-form';
import type { DailyWorkout } from '@bene/shared';
import { Button, Slider, useAppForm,typography } from '@/lib/components';

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
    if (val <= 2) return 'Active Recovery';
    if (val <= 4) return 'Flow State';
    if (val <= 6) return 'High Performance';
    if (val <= 8) return 'Peak Challenge';
    return 'Total Failure';
  };

  const getTickLabel = (t: number) => {
    if (t === 1) return 'Minimum';
    if (t === 5) return 'Threshold';
    return 'Maximum';
  };

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
            {/* TODO replace with RPE picker component */}
            <form.AppField name="performance.perceivedExertion">
              {(field) => (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity size={18} className="text-primary" />
                      <h4 className={typography.labelSm}>Intensity Index (RPE)</h4>
                    </div>
                    {/* Enhanced RPE Indicator */}
                    <div className="bg-primary/10 border-primary/20 flex h-12 w-16 items-center justify-center rounded-xl border shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)]">
                      <h2 className={`${typography.displayMd} text-primary`}>
                        {field.state.value}
                      </h2>
                    </div>
                  </div>

                  <div className="bg-accent/40 border-border/50 space-y-8 rounded-3xl border p-8">
                    <div className="text-center">
                      <h3 className={`${typography.displayLg} text-primary mb-1`}>
                        {getRpeLabel(field.state.value)}
                      </h3>
                      <p className={typography.displaySm}>Subjective Exertion Rating</p>
                    </div>

                    <div className="relative px-2 pt-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        variant="gradient"
                        ticks={[1, 5, 10]}
                        getTickLabel={getTickLabel}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              )}
            </form.AppField>

            {/* Notes Section */}
            <form.AppField name="performance.notes">
              {(field) => (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <PenLine size={18} className="text-primary" />
                    <h4 className={typography.labelSm}>Coach Transcription</h4>
                  </div>
                  <div className="group relative">
                    <textarea
                      className={`${typography.small} bg-accent/20 border-border/50 focus:border-primary/50 focus:ring-primary/5 placeholder:text-muted-foreground/30 no-scrollbar min-h-[120px] w-full rounded-2xl border p-5 leading-relaxed transition-all focus:ring-4`}
                      placeholder="Input physiological feedback, form observations, or cognitive state during peak loads..."
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
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
              className={`${typography.labelSm} bg-primary text-primary-foreground shadow-primary/30 group h-16 w-full rounded-[24px] italic shadow-2xl transition-all hover:scale-[1.02] active:scale-95`}
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
