import { planGenerationFormOpts } from './form-options';
import { CategorizedEquipmentSelection, typography, withForm } from '@/lib/components';
import { IntensitySlider } from '@/lib/components/fitness/workouts/intensity-slider';

export const PlanTrainingStep = withForm({
  ...planGenerationFormOpts,
  render: ({ form }) => (
    <div className="h-full space-y-8">
      <form.AppField name="goals.targetMetrics.totalWorkouts">
        {(field) => (
          <IntensitySlider
            value={field.state.value}
            onChange={field.handleChange}
            variant="frequency"
          />
        )}
      </form.AppField>

      <form.AppField name="availableEquipment">
        {(field) => (
          <div className="space-y-4">
            <label className={`${typography.large} font-bold`}>Available Equipment</label>
            <CategorizedEquipmentSelection
              selected={field.state.value || []}
              onChange={field.handleChange}
            />
          </div>
        )}
      </form.AppField>
    </div>
  ),
});