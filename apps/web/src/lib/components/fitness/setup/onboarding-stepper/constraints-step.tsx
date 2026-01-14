import { Check } from 'lucide-react';
import { EQUIPMENT_OPTIONS } from '@bene/shared';
import { onboardingFormOpts } from './form-options';
import { Label, typography, withForm } from '@/lib/components';

// Use indexed access type directly in component props
// type Equipment = (typeof EQUIPMENT_OPTIONS)[number];

function EquipmentButton({
  equipment,
  selectedValues,
  onChange,
}: {
  equipment: (typeof EQUIPMENT_OPTIONS)[number];
  selectedValues: (typeof EQUIPMENT_OPTIONS)[number][];
  onChange: (_val: (typeof EQUIPMENT_OPTIONS)[number][]) => void;
}) {
  const isSelected = selectedValues.includes(equipment);

  const handleClick = () => {
    const createNew = isSelected
      ? selectedValues.filter((e) => e !== equipment)
      : [...selectedValues, equipment];
    onChange(createNew);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${typography.small} rounded-md border p-2 text-left ${
        isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted'
      }`}
    >
      <div className="flex items-center justify-between">
        {equipment}
        {isSelected && <Check size={14} className="text-primary" />}
      </div>
    </button>
  );
}

export const ConstraintsStep = withForm({
  ...onboardingFormOpts,
  render: ({ form }) => (
    <div className="space-y-6">
      <div>
        <form.AppField name="daysPerWeek">
          {(field) => (
            <>
              <Label className="mb-3 block">Days per week: {field.state.value}</Label>
              <input
                type="range"
                min="1"
                max="7"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="w-full"
              />
              <div className={`${typography.mutedXs} mt-1 flex justify-between`}>
                <span>1 day</span>
                <span>7 days</span>
              </div>
            </>
          )}
        </form.AppField>
      </div>

      <div>
        <form.AppField name="minutesPerWorkout">
          {(field) => (
            <>
              <Label className="mb-3 block">Max Duration: {field.state.value} min</Label>
              <div className="flex gap-2">
                {[30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => field.handleChange(mins)}
                    className={`${typography.labelXs} flex-1 rounded-md border py-2 ${
                      field.state.value === mins
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </>
          )}
        </form.AppField>
      </div>

      <div>
        <form.AppField name="equipment">
          {(field) => (
            <>
              <Label className="mb-3 block">Equipment</Label>
              <div className="grid grid-cols-2 gap-2">
                {EQUIPMENT_OPTIONS.map((eq) => (
                  <EquipmentButton
                    key={eq}
                    equipment={eq}
                    selectedValues={
                      (field.state.value || []) as (typeof EQUIPMENT_OPTIONS)[number][]
                    }
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
