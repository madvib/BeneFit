import { withForm } from '@/lib/components/app-form/app-form';
import { Typography } from '@/lib/components';
import { onboardingFormOpts } from './form-options';
import { PrimaryGoalGrid, SecondaryGoalsList } from '@/lib/components/fitness/goal-selection-ui';

export const GoalsStep = withForm({
  ...onboardingFormOpts,
  render: ({ form }) => (
    <div className="space-y-10 px-2 sm:px-0">
      <div>
        <form.AppField name="primaryGoal">
          {(field) => (
            <>
              <Typography variant="h3" className="mb-6">
                Primary Goal
              </Typography>
              <PrimaryGoalGrid selected={field.state.value} onChange={field.handleChange} />
            </>
          )}
        </form.AppField>
      </div>

      <div className="bg-border h-px" />

      <div>
        <form.AppField name="secondaryGoals">
          {(field) => (
            <>
              <Typography variant="h3" className="mb-6">
                Secondary Goals
              </Typography>
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
