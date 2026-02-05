import { planGenerationFormOpts } from './form-options';
import { typography, withForm } from '@/lib/components';

export const PlanCustomizeStep = withForm({
  ...planGenerationFormOpts,
  render: ({ form }) => (
    <div className="h-full space-y-8">
      <form.AppField name="customInstructions">
        {(field) => (
          <div className="space-y-4">
            <label className={`${typography.large} font-bold`}>
              Custom instructions (optional)
            </label>
            <div className="relative">
              <textarea
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`${typography.small} border-input bg-background/50 focus:bg-background focus:ring-primary/20 h-40 w-full rounded-2xl border p-5 transition-all outline-none focus:ring-2`}
                placeholder="E.g., 'Focus on upper body', 'I prefer shorter workouts', 'I have a sensitive shoulder'..."
              />
            </div>
          </div>
        )}
      </form.AppField>
      <form.SubmissionError />
    </div>
  ),
});