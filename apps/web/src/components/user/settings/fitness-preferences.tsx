'use client';

import { Card, Select } from '@/components/common';

type PreferredUnits = 'Metric (kg, km)' | 'Imperial (lbs, miles)';
type GoalFocus = 'Weight Loss' | 'Muscle Building' | 'General Fitness';

interface FitnessPreferencesProps {
  preferredUnits: PreferredUnits;
  goalFocus: GoalFocus;
  onPreferredUnitsChange: (_value: PreferredUnits) => void;
  onGoalFocusChange: (_value: GoalFocus) => void;
}

export default function FitnessPreferences({
  preferredUnits,
  goalFocus,
  onPreferredUnitsChange,
  onGoalFocusChange,
}: FitnessPreferencesProps) {
  return (
    <Card className="mb-8">
      <h3 className="mb-4 text-2xl font-semibold">Fitness Preferences</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-foreground mb-2 block">Preferred Units</label>
          <Select
            value={preferredUnits}
            onChange={(e) =>
              onPreferredUnitsChange(
                e.target.value as 'Metric (kg, km)' | 'Imperial (lbs, miles)',
              )
            }
          >
            <option value="Metric (kg, km)">Metric (kg, km)</option>
            <option value="Imperial (lbs, miles)">Imperial (lbs, miles)</option>
          </Select>
        </div>
        <div>
          <label className="text-foreground mb-2 block">Goal Focus</label>
          <Select
            value={goalFocus}
            onChange={(e) =>
              onGoalFocusChange(
                e.target.value as 'Weight Loss' | 'Muscle Building' | 'General Fitness',
              )
            }
          >
            <option value="Weight Loss">Weight Loss</option>
            <option value="Muscle Building">Muscle Building</option>
            <option value="General Fitness">General Fitness</option>
          </Select>
        </div>
      </div>
    </Card>
  );
}
