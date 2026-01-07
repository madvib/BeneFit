import { withForm } from '@/lib/components/app-form/app-form';
import { FITNESS_GOALS } from '@bene/shared';
import { Label } from '@/lib/components';
import { onboardingFormOpts } from './form-options';

function GoalToggleButton({
  goal,
  selectedValues,
  onChange,
}: {
  goal: string;
  selectedValues: string[];
  onChange: (_val: string[]) => void;
}) {
  const id = goal.toLowerCase();
  const isSelected = selectedValues.includes(id);

  const handleClick = () => {
    const createNew = isSelected
      ? selectedValues.filter((g) => g !== id)
      : [...selectedValues, id];
    onChange(createNew);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
        isSelected ? 'bg-accent text-accent-foreground border-accent' : 'hover:bg-muted'
      }`}
    >
      {goal}
    </button>
  );
}

export const GoalsStep = withForm({
  ...onboardingFormOpts,
  render: ({ form }) => (
    <div className="space-y-6">
      <div>
        <form.AppField name="primaryGoal">
          {(field) => (
            <>
              <Label className="mb-3 block text-base">Primary Goal</Label>
              <div className="grid grid-cols-2 gap-3">
                {FITNESS_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => field.handleChange(goal)}
                    className={`rounded-lg border p-3 text-sm font-medium capitalize transition-all ${
                      field.state.value === goal
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    {goal.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </>
          )}
        </form.AppField>
      </div>

      <div>
        <form.AppField name="secondaryGoals">
          {(field) => (
            <>
              <Label className="mb-3 block text-base">Secondary Goals</Label>
              <div className="flex flex-wrap gap-2">
                {['Consistency', 'Flexibility', 'Mobility', 'Recovery'].map((goal) => (
                  <GoalToggleButton
                    key={goal}
                    goal={goal}
                    selectedValues={field.state.value || []}
                    onChange={field.handleChange}
                  />
                ))}
              </div>
            </>
          )}
        </form.AppField>
      </div>
    </div>
  ),
});
