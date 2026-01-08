import { FITNESS_GOALS, SECONDARY_GOALS } from '@bene/shared';
import { GOAL_UI_CONFIG, SECONDARY_GOAL_LABELS } from '@/config/training-ui';

// Backward compatibility exports if needed, but components should use config directly
export const GOAL_METADATA = GOAL_UI_CONFIG;
export { SECONDARY_GOAL_LABELS };

interface GoalGridProps {
  selected: string;
  onChange: (_value: string) => void;
  isLoading?: boolean;
}

export function PrimaryGoalGrid({ selected, onChange, isLoading }: GoalGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {FITNESS_GOALS.map((goalValue) => {
        // eslint-disable-next-line security/detect-object-injection
        const meta = GOAL_METADATA[goalValue];
        if (!meta) return null;
        const Icon = meta.icon;
        const isSelected = selected === goalValue;
        return (
          <button
            key={goalValue}
            type="button"
            onClick={() => onChange(goalValue)}
            className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
              isSelected ? 'border-primary bg-primary/10' : 'hover:border-primary/50'
            }`}
            disabled={isLoading}
          >
            <Icon size={20} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
            <span className="font-medium">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}

interface SecondaryGoalsProps {
  selected: string[];
  onChange: (_value: string[]) => void;
  isLoading?: boolean;
}

export function SecondaryGoalsList({ selected, onChange, isLoading }: SecondaryGoalsProps) {
  const toggleGoal = (val: string) => {
    const newValues = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    onChange(newValues);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {SECONDARY_GOALS.map((goalValue) => (
        <button
          key={goalValue}
          type="button"
          onClick={() => toggleGoal(goalValue)}
          className={`rounded-full px-4 py-2 text-sm transition-all ${
            selected.includes(goalValue)
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-foreground hover:bg-accent/80'
          }`}
          disabled={isLoading}
        >
          {/* eslint-disable-next-line security/detect-object-injection */}
          {SECONDARY_GOAL_LABELS[goalValue] || goalValue}
        </button>
      ))}
    </div>
  );
}

// Re-export categorized goal component alias if used elsewhere
export const CategorizedGoalSelection = PrimaryGoalGrid;
