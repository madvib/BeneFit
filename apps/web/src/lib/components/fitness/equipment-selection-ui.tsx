import React from 'react';
import { EQUIPMENT_CATEGORIES } from '@bene/shared';
import { Check } from 'lucide-react';

interface EquipmentSelectionProps {
  selected: string[];
  onChange: (_value: string[]) => void;
  isLoading?: boolean;
}

export function CategorizedEquipmentSelection({
  selected,
  onChange,
  isLoading,
}: EquipmentSelectionProps) {
  const toggleEquipment = (val: string) => {
    const newValues = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    onChange(newValues);
  };

  const formatLabel = (val: string) => {
    return val
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {Object.entries(EQUIPMENT_CATEGORIES).map(([category, equipment]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            {category}
          </h4>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => {
              const isSelected = selected.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleEquipment(item)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-primary/20 shadow-sm ring-1'
                      : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}
                    >
                      {formatLabel(item)}
                    </span>
                    {isSelected && <Check size={14} className="text-primary shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
