'use client';

type PreferredUnits = 'Metric (kg, km)' | 'Imperial (lbs, miles)';
type GoalFocus = 'Weight Loss' | 'Muscle Building' | 'General Fitness';

interface FitnessPreferencesProps {
  preferredUnits: PreferredUnits;
  goalFocus: GoalFocus;
  onPreferredUnitsChange: (value: PreferredUnits) => void;
  onGoalFocusChange: (value: GoalFocus) => void;
}

export default function FitnessPreferences({ 
  preferredUnits, 
  goalFocus,
  onPreferredUnitsChange,
  onGoalFocusChange
}: FitnessPreferencesProps) {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold mb-4">Fitness Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-foreground mb-2">
            Preferred Units
          </label>
          <select 
            className="w-full p-2 rounded border border-muted bg-background"
            value={preferredUnits}
            onChange={(e) => onPreferredUnitsChange(e.target.value as 'Metric (kg, km)' | 'Imperial (lbs, miles)')}
          >
            <option value="Metric (kg, km)">Metric (kg, km)</option>
            <option value="Imperial (lbs, miles)">Imperial (lbs, miles)</option>
          </select>
        </div>
        <div>
          <label className="block text-foreground mb-2">Goal Focus</label>
          <select 
            className="w-full p-2 rounded border border-muted bg-background"
            value={goalFocus}
            onChange={(e) => onGoalFocusChange(e.target.value as 'Weight Loss' | 'Muscle Building' | 'General Fitness')}
          >
            <option value="Weight Loss">Weight Loss</option>
            <option value="Muscle Building">Muscle Building</option>
            <option value="General Fitness">General Fitness</option>
          </select>
        </div>
      </div>
    </div>
  );
}