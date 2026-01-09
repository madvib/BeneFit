import { withForm } from '@/lib/components/app-form/app-form';
import { FITNESS_GOALS, SECONDARY_GOALS } from '@bene/shared';
import { Label } from '@/lib/components';
import { onboardingFormOpts } from './form-options';

function GoalToggleButton({
  value,
  label,
  selectedValues,
  onChange,
}: {
  value: string;
  label: string;
  selectedValues: string[];
  onChange: (_val: string[]) => void;
}) {
  const isSelected = selectedValues.includes(value);

  const handleClick = () => {
    const createNew = isSelected
      ? selectedValues.filter((g) => g !== value)
      : [...selectedValues, value];
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
      {label}
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
                {(SECONDARY_GOALS as readonly string[]).slice(0, 10).map((goal) => (
                  <GoalToggleButton
                    key={goal}
                    value={goal}
                    label={goal
                      .split('_')
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
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
