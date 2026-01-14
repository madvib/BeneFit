'use client';


import { Card, Select, typography } from '@/lib/components';
type PreferredUnits = 'metric' | 'imperial';
type GoalFocus = 'motivational' | 'casual' | 'professional' | 'tough_love';

interface FitnessPreferencesProps {
  preferredUnits: PreferredUnits;
  goalFocus: GoalFocus;
  onPreferredUnitsChange: (_value: PreferredUnits) => void;
  onGoalFocusChange: (_value: GoalFocus) => void;
}

export function FitnessPreferences({
  preferredUnits,
  goalFocus,
  onPreferredUnitsChange,
  onGoalFocusChange,
}: FitnessPreferencesProps) {
  return (
    <Card className="mb-8 p-6">
      <h3 className={typography.h3}>Fitness Preferences</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="mt-4">
          <label className={`${typography.h4} mb-2 block`}>Preferred Units</label>
          <Select
            value={preferredUnits}
            onChange={(e) => onPreferredUnitsChange(e.target.value as 'metric' | 'imperial')}
          >
            <option value="metric">Metric (kg, km)</option>
            <option value="imperial">Imperial (lbs, miles)</option>
          </Select>
        </div>
        <div className="mt-4">
          <label className={`${typography.h4} mb-2 block`}>Goal Focus</label>
          <Select
            value={goalFocus}
            onChange={(e) =>
              onGoalFocusChange(
                e.target.value as 'motivational' | 'casual' | 'professional' | 'tough_love',
              )
            }
          >
            <option value="motivational">Motivational</option>
            <option value="casual">Casual</option>
            <option value="professional">Professional</option>
            <option value="tough_love">Tough Love</option>
          </Select>
        </div>
      </div>
    </Card>
  );
}
