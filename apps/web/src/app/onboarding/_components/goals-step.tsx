import { withForm } from '@/lib/components/app-form/app-form';
import { Label } from '@/lib/components';
import { onboardingFormOpts } from './form-options';
import { PrimaryGoalGrid, SecondaryGoalsList } from '@/lib/components/fitness/goal-selection-ui';

export const GoalsStep = withForm({
  ...onboardingFormOpts,
  render: ({ form }) => (
    <div className="space-y-8">
      <div>
        <form.AppField name="primaryGoal">
          {(field) => (
            <>
              <Label className="mb-4 block text-lg font-bold">Primary Goal</Label>
              <PrimaryGoalGrid selected={field.state.value} onChange={field.handleChange} />
            </>
          )}
        </form.AppField>
      </div>

      <div>
        <form.AppField name="secondaryGoals">
          {(field) => (
            <>
              <Label className="mb-4 block text-lg font-bold">Secondary Goals</Label>
              <SecondaryGoalsList
                selected={field.state.value || []}
                onChange={field.handleChange}
              />
            </>
          )}
        </form.AppField>
      </div>
    </div>
  ),
});
