import { withForm } from '@/lib/components/app-form/app-form';
;
import { onboardingFormOpts } from './form-options';
import { PrimaryGoalGrid, SecondaryGoalsList } from '@/lib/components/fitness/goal-selection-ui';
import { typography } from '@/lib/components/theme/typography';

export const GoalsStep = withForm({
  ...onboardingFormOpts,
  render: ({ form }) => (
    <div className="space-y-10 px-2 sm:px-0">
      <div>
        <form.AppField name="primaryGoal">
          {(field) => (
            <>
              <h3 className={`${typography.h3} mb-6`}>
                Primary Goal
              </h3>
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
              <h3 className={`${typography.h3} mb-6`}>
                Secondary Goals
              </h3>
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
