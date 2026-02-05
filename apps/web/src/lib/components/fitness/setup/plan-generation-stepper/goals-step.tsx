import { planGenerationFormOpts } from './form-options';
import { PrimaryGoalGrid, SecondaryGoalsList, typography, withForm } from '@/lib/components';

export const PlanGoalsStep = withForm({
  ...planGenerationFormOpts,
  render: ({ form }) => (
    <div className="h-full space-y-8">
      <form.AppField name="goals.primary">
        {(field) => (
          <div className="space-y-4">
            <label className={`${typography.large} font-bold`}>
              What&apos;s your primary goal?
            </label>
            <PrimaryGoalGrid
              selected={field.state.value}
              onChange={field.handleChange}
            />
          </div>
        )}
      </form.AppField>

      <form.AppField name="goals.secondary">
        {(field) => (
          <div className="space-y-4">
            <label className={`${typography.large} font-bold`}>
              Secondary goals (optional)
            </label>
            <SecondaryGoalsList
              selected={(field.state.value as any) || []}
              onChange={field.handleChange as any}
            />
          </div>
        )}
      </form.AppField>
    </div>
  ),
});