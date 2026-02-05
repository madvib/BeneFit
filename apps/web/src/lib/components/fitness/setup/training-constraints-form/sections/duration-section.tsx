

import { Clock } from 'lucide-react';
import { typography, withForm } from '@/lib/components';
import { trainingConstraintsFormOptions } from '../form-options';

const DURATION_OPTIONS = [30, 45, 60, 90] as const;

export const DurationSection = withForm({
  ...trainingConstraintsFormOptions,
  render: ({ form, ...props }) => {
    const { isLoading } = props as { isLoading?: boolean };
    return (
      <form.AppField name="maxDuration">
        {(field) => (
          <div className="space-y-4">
            <label className={`${typography.h4} flex items-center gap-2`}>
              <Clock size={18} className="text-primary" /> Max Workout Duration
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DURATION_OPTIONS.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => field.handleChange(mins)}
                  className={`${typography.p} border-border/60 rounded-xl border px-4 py-3 text-sm transition-all duration-200 ${
                    field.state.value === mins
                      ? 'border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                      : 'bg-background hover:border-primary/40 hover:bg-accent/5'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {mins} min
                </button>
              ))}
            </div>
            {field.state.meta.errors ? (
              <p className={`${typography.xs} text-destructive px-1 mt-1`}>
                {field.state.meta.errors.join(', ')}
              </p>
            ) : null}
          </div>
        )}
      </form.AppField>
    );
  },
});
