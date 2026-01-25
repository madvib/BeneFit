'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { INJURY_SEVERITY_LEVELS } from '@bene/shared';
import { Button, Input, Select, Badge, typography, withForm } from '@/lib/components';
import { trainingConstraintsFormOptions } from '../form-options';

const SEVERITY_VARIANTS: Record<string, 'error' | 'warning' | 'outline'> = {
  serious: 'error',
  moderate: 'warning',
  minor: 'outline',
};

export const InjurySection = withForm({
  ...trainingConstraintsFormOptions,
  render: ({ form, ...props }) => {
    const { isLoading } = props as { isLoading?: boolean };
    const [injuryForm, setInjuryForm] = useState({
      bodyPart: '',
      severity: INJURY_SEVERITY_LEVELS[0] as (typeof INJURY_SEVERITY_LEVELS)[number],
      notes: '',
    });

    return (
      <form.AppField name="injuries">
        {(field) => {
          const currentInjuries = field.state.value || [];
          
          const addInjury = () => {
            if (injuryForm.bodyPart.trim()) {
              field.handleChange([
                ...currentInjuries,
                {
                  ...injuryForm,
                  bodyPart: injuryForm.bodyPart.trim(),
                  avoidExercises: [],
                  reportedDate: new Date(),
                },
              ]);
              setInjuryForm({
                bodyPart: '',
                severity: INJURY_SEVERITY_LEVELS[0],
                notes: '',
              });
            }
          };

          const removeInjury = (index: number) => {
            field.handleChange(currentInjuries.filter((_, i) => i !== index));
          };

          return (
            <div className="space-y-4">
              <label className={`${typography.h4} flex items-center gap-2`}>
                <AlertTriangle size={18} className="text-primary" /> Injuries & Limitations
              </label>
              
              <div className="bg-accent/5 space-y-4 rounded-2xl border border-border/50 p-5 shadow-sm">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className={`${typography.labelXs} text-muted-foreground px-1 font-semibold`}>Body Part / Limitation</label>
                    <Input
                      placeholder="e.g., Lower back, Left knee"
                      value={injuryForm.bodyPart}
                      onChange={(e) => setInjuryForm(prev => ({ ...prev, bodyPart: e.target.value }))}
                      disabled={isLoading}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`${typography.labelXs} text-muted-foreground px-1 font-semibold`}>Severity</label>
                    <Select
                      value={injuryForm.severity}
                      onChange={(e) => setInjuryForm(prev => ({ ...prev, severity: e.target.value as (typeof INJURY_SEVERITY_LEVELS)[number] }))}
                      disabled={isLoading}
                      className="bg-background/50 w-full"
                    >
                      {INJURY_SEVERITY_LEVELS.map(level => (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`${typography.labelXs} text-muted-foreground px-1 font-semibold`}>Notes / Limitations (Optional)</label>
                  <Input
                    placeholder="e.g., Avoid heavy axial loading"
                    value={injuryForm.notes}
                    onChange={(e) => setInjuryForm(prev => ({ ...prev, notes: e.target.value }))}
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addInjury}
                    disabled={!injuryForm.bodyPart.trim() || isLoading}
                    size="sm"
                    className="rounded-xl px-4 shadow-sm"
                  >
                    Add Limitation
                  </Button>
                </div>
              </div>

              {currentInjuries.length > 0 && (
                <div className="mt-6 space-y-3">
                  {currentInjuries.map((injury, idx: number) => (
                    <div
                      key={idx}
                      className="bg-background border-border/40 hover:border-primary/30 flex items-center justify-between rounded-2xl border p-4 shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={SEVERITY_VARIANTS[injury.severity] || 'outline'}
                          className="rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm"
                        >
                          {injury.severity}
                        </Badge>
                        <div className="space-y-0.5">
                          <p className={`${typography.p} font-bold leading-tight`}>{injury.bodyPart}</p>
                          {injury.notes && (
                            <p className={`${typography.xs} text-muted-foreground italic leading-tight`}>
                              {injury.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInjury(idx)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 p-0 rounded-xl"
                        aria-label="Remove limitation"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {currentInjuries.length === 0 && (
                <div className="bg-accent/5 border-border/30 flex items-center justify-center rounded-2xl border border-dashed py-8">
                  <p className={`${typography.xs} text-muted-foreground italic`}>
                    No injuries or physical limitations reported.
                  </p>
                </div>
              )}
            </div>
          );
        }}
      </form.AppField>
    );
  },
});
