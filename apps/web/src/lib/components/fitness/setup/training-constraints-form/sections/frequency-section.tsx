'use client';

import { Calendar } from 'lucide-react';
import { WEEK_DAYS } from '@bene/shared';
import { typography, withForm } from '@/lib/components';
import { trainingConstraintsFormOptions } from '../form-options';

export const FrequencySection = withForm({
  ...trainingConstraintsFormOptions,
  render: ({ form, ...props }) => {
    const { isLoading } = props as { isLoading?: boolean };
    return (
      <form.AppField name="availableDays">
        {(field) => {
          const currentDays = field.state.value || [];
          const daysCount = currentDays.length;
          const handleDaysChange = (count: number) => {
            field.handleChange(WEEK_DAYS.slice(0, count));
          };

          return (
            <div className="space-y-4">
              <label className={`${typography.h4} flex items-center gap-2`}>
                <Calendar size={18} className="text-primary" /> Training Frequency
              </label>
              <div className="bg-accent/10 border-border/50 flex items-center gap-4 rounded-xl border p-5 shadow-sm">
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={daysCount || 3}
                  onChange={(e) => handleDaysChange(Number(e.target.value))}
                  className="accent-primary h-2 w-full cursor-pointer rounded-lg bg-gray-200 dark:bg-gray-700"
                  disabled={isLoading}
                />
                <span className={`${typography.h4} min-w-[100px] text-right text-primary`}>
                  {daysCount} {daysCount === 1 ? 'day' : 'days'} / week
                </span>
              </div>
              {field.state.meta.errors ? (
                <p className={`${typography.xs} text-destructive px-1 mt-1`}>
                  {field.state.meta.errors.join(', ')}
                </p>
              ) : null}
            </div>
          );
        }}
      </form.AppField>
    );
  },
});
