import { FITNESS_GOALS, SECONDARY_GOAL_CATEGORIES } from '@bene/shared';
import { GOAL_UI_CONFIG, SECONDARY_GOAL_LABELS } from '@/lib/constants/training-ui';
import { typography } from '../theme/typography';

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
              isSelected
                ? 'border-primary bg-primary/10 ring-primary/20 shadow-md ring-1'
                : 'border-border/60 hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm'
            }`}
            disabled={isLoading}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                isSelected
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              }`}
            >
              <Icon size={24} className="transition-transform group-hover:scale-110" />
            </div>
            <span
              className={`${typography.small} transition-colors ${isSelected ? 'text-primary' : 'text-foreground/90'}`}
            >
              {meta.label}
            </span>
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

  const formatLabel = (val: string) => {
    return (
      SECONDARY_GOAL_LABELS[val] ||
      val
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    );
  };

  return (
    <div className="space-y-6">
      {Object.entries(SECONDARY_GOAL_CATEGORIES).map(([category, goals]) => (
        <div key={category} className="space-y-3">
          <h4 className={`${typography.labelSm} text-muted-foreground`}>{category}</h4>
          <div className="flex flex-wrap gap-2">
            {goals.map((goalValue) => (
              <button
                key={goalValue}
                type="button"
                onClick={() => toggleGoal(goalValue)}
                className={`${typography.small} rounded-full px-4 py-2 transition-all ${
                  selected.includes(goalValue)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-background hover:bg-accent border-muted-foreground/20 text-muted-foreground border'
                }`}
                disabled={isLoading}
              >
                {formatLabel(goalValue)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Re-export categorized goal component alias if used elsewhere
export const CategorizedGoalSelection = PrimaryGoalGrid;
