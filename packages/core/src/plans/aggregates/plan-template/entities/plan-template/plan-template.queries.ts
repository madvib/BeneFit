import { TrainingConstraints } from '../../../../value-objects/training-constraints/training-constraints.js';
import { ExperienceLevel } from '../template-rules/template-rules.js';
import { PlanTemplate } from './plan-template.js';

export interface TemplateCompatibilityResult {
  canUse: boolean;
  reasons: string[];
}

export function canUserCustomizeTemplate(
  template: PlanTemplate,
  userConstraints: TrainingConstraints,
  userExperienceLevel: ExperienceLevel = 'beginner',
): TemplateCompatibilityResult {
  const reasons: string[] = [];

  // Check experience level
  const levels: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced'];
  const userLevel = levels.indexOf(userExperienceLevel);
  const minLevel = levels.indexOf(template.rules.minExperienceLevel);
  const maxLevel = levels.indexOf(template.rules.maxExperienceLevel);

  if (userLevel < minLevel) {
    reasons.push(
      `This template requires ${template.rules.minExperienceLevel} experience`,
    );
  }
  if (userLevel > maxLevel) {
    reasons.push(
      `This template is designed for ${template.rules.maxExperienceLevel} level`,
    );
  }

  // Check injuries
  if (template.rules.restrictions?.noInjuries) {
    const conflictingInjuries = userConstraints.injuries.filter((injury) =>
      template.rules.restrictions!.noInjuries!.includes(injury),
    );
    if (conflictingInjuries.length > 0) {
      reasons.push(`Not suitable with: ${conflictingInjuries.join(', ')}`);
    }
  }

  // Check equipment
  if (template.rules.restrictions?.requiresEquipment) {
    const missingEquipment = template.rules.restrictions.requiresEquipment.filter(
      (equipment) => !userConstraints.availableEquipment.includes(equipment),
    );
    if (missingEquipment.length > 0) {
      reasons.push(`Requires equipment: ${missingEquipment.join(', ')}`);
    }
  }

  // Check location
  if (template.rules.restrictions?.requiresLocation) {
    if (
      !template.rules.restrictions.requiresLocation.includes(
        userConstraints.preferredLocation,
      )
    ) {
      reasons.push(
        `Requires location: ${template.rules.restrictions.requiresLocation.join(' or ')}`,
      );
    }
  }

  // Check available days
  if (template.rules.requiredDaysPerWeek) {
    if (userConstraints.availableDays.length < template.rules.requiredDaysPerWeek) {
      reasons.push(`Requires ${template.rules.requiredDaysPerWeek} days per week`);
    }
  }

  // Check session duration
  if (template.rules.restrictions?.minSessionMinutes) {
    if (
      userConstraints.maxDurationMinutes < template.rules.restrictions.minSessionMinutes
    ) {
      reasons.push(
        `Requires at least ${template.rules.restrictions.minSessionMinutes} minutes per session`,
      );
    }
  }

  return {
    canUse: reasons.length === 0,
    reasons,
  };
}

export function estimateTemplateDuration(template: PlanTemplate): {
  minWeeks: number;
  maxWeeks: number;
} {
  const duration = template.structure.duration;

  if (duration.type === 'fixed') {
    return { minWeeks: duration.weeks, maxWeeks: duration.weeks };
  }

  return { minWeeks: duration.min, maxWeeks: duration.max };
}

export function getTemplateFrequency(template: PlanTemplate): {
  minWorkouts: number;
  maxWorkouts: number;
} {
  const frequency = template.structure.frequency;

  if (frequency.type === 'fixed') {
    return {
      minWorkouts: frequency.workoutsPerWeek,
      maxWorkouts: frequency.workoutsPerWeek,
    };
  }

  return {
    minWorkouts: frequency.min,
    maxWorkouts: frequency.max,
  };
}
