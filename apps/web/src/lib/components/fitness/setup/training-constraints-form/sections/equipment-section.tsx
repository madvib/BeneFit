

import { Dumbbell } from 'lucide-react';
import { CategorizedEquipmentSelection, typography, withForm } from '@/lib/components';
import { trainingConstraintsFormOptions } from '../form-options';

export const EquipmentSection = withForm({
  ...trainingConstraintsFormOptions,
  render: ({ form, ...props }) => {
    const { isLoading } = props as { isLoading?: boolean };
    return (
      <form.AppField name="availableEquipment">
        {(field) => (
          <div className="space-y-4">
            <label className={`${typography.h4} flex items-center gap-2`}>
              <Dumbbell size={18} className="text-primary" /> Available Equipment
            </label>
            <div className="bg-accent/5 rounded-2xl border border-dashed border-border/60 p-1">
              <CategorizedEquipmentSelection
                selected={field.state.value || []}
                onChange={field.handleChange}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </form.AppField>
    );
  },
});
