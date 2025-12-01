import { TrainingConstraints, Injury } from './training-constraints.types.js';
import { VALID_DAYS } from '../../constants.js';

// Query methods
export function hasInjuries(constraints: TrainingConstraints): boolean {
  return constraints.injuries !== undefined && constraints.injuries.length > 0;
}

export function getReportedInjuries(constraints: TrainingConstraints): Injury[] {
  return constraints.injuries ? [...constraints.injuries] : [];
}

export function isInjurySeverity(constraints: TrainingConstraints, bodyPart: string, severity: string): boolean {
  if (!constraints.injuries) return false;
  
  const injury = constraints.injuries.find(i => i.bodyPart.toLowerCase() === bodyPart.toLowerCase());
  return injury ? injury.severity === severity : false;
}

export function canExercise(constraints: TrainingConstraints, exercise: string): boolean {
  if (!constraints.injuries) return true;
  
  // Check if any injury should avoid this exercise
  for (const injury of constraints.injuries) {
    if (injury.avoidExercises.some(avoid => avoid.toLowerCase().includes(exercise.toLowerCase()))) {
      return false;
    }
  }
  
  return true;
}

export function hasEquipment(constraints: TrainingConstraints, equipment: string): boolean {
  return constraints.availableEquipment.some(item => 
    item.toLowerCase().includes(equipment.toLowerCase())
  );
}

export function canTrainAtTime(constraints: TrainingConstraints, time: string): boolean {
  if (!constraints.preferredTime) return true;
  
  const timeLower = time.toLowerCase();
  const prefTime = constraints.preferredTime.toLowerCase();
  
  return timeLower.includes(prefTime) || prefTime.includes(timeLower);
}

export function isAvailableDay(constraints: TrainingConstraints, day: string): boolean {
  return constraints.availableDays.includes(day);
}

export function getAvailableDaysCount(constraints: TrainingConstraints): number {
  return constraints.availableDays.length;
}

export function getMaxTrainingHoursPerWeek(constraints: TrainingConstraints): number {
  if (!constraints.maxDuration) return 0;
  return (constraints.maxDuration / 60) * getAvailableDaysCount(constraints); // Convert minutes to hours and multiply by days
}

export function isLocationAvailable(constraints: TrainingConstraints, location: string): boolean {
  return constraints.location === location || constraints.location === 'mixed';
}

export function getDaysUntilNextAvailable(constraints: TrainingConstraints, fromDay: string): number {
  const fromIndex = VALID_DAYS.indexOf(fromDay);
  if (fromIndex === -1) return -1;
  
  // Look forward in the week
  for (let i = 1; i <= 7; i++) {
    const checkIndex = (fromIndex + i) % 7;
    if (constraints.availableDays.includes(VALID_DAYS[checkIndex]!)) {
      return i;
    }
  }
  
  return -1; // Not found
}

// Transformation methods (immutable)
export function withAddedEquipment(constraints: TrainingConstraints, equipment: string[]): TrainingConstraints {
  const newEquipment = [...new Set([...constraints.availableEquipment, ...equipment])];
  return {
    ...constraints,
    availableEquipment: newEquipment,
  };
}

export function withAddedAvailableDay(constraints: TrainingConstraints, day: string): TrainingConstraints {
  if (constraints.availableDays.includes(day)) {
    return constraints;
  }
  
  const newDays = [...constraints.availableDays, day];
  return {
    ...constraints,
    availableDays: newDays,
  };
}

export function withAddedInjury(constraints: TrainingConstraints, injury: Injury): TrainingConstraints {
  const newInjuries = constraints.injuries ? [...constraints.injuries, injury] : [injury];
  return {
    ...constraints,
    injuries: newInjuries,
  };
}

export function withExtendedDuration(constraints: TrainingConstraints, additionalMinutes: number): TrainingConstraints {
  if (constraints.maxDuration === undefined) return constraints;
  
  return {
    ...constraints,
    maxDuration: constraints.maxDuration + additionalMinutes,
  };
}

export function withNewLocation(constraints: TrainingConstraints, location: string): TrainingConstraints {
  if (!['home', 'gym', 'outdoor', 'mixed'].includes(location)) {
    return constraints; // Invalid location
  }
  
  return {
    ...constraints,
    location: location as 'home' | 'gym' | 'outdoor' | 'mixed',
  };
}

export function withoutInjury(constraints: TrainingConstraints, bodyPart: string): TrainingConstraints {
  if (!constraints.injuries) return constraints;
  
  const newInjuries = constraints.injuries.filter(injury => 
    injury.bodyPart.toLowerCase() !== bodyPart.toLowerCase()
  );
  
  return {
    ...constraints,
    injuries: newInjuries.length > 0 ? newInjuries : undefined,
  };
}

// Calculation methods
export function getWeeklyTrainingAvailability(constraints: TrainingConstraints): number {
  // Returns a score from 0-1 representing weekly availability (0 = no available days, 1 = 7+ days)
  return Math.min(1, getAvailableDaysCount(constraints) / 7);
}

export function getEquipmentAvailabilityScore(constraints: TrainingConstraints, requiredEquipment: string[]): number {
  // Returns a score from 0-1 representing equipment match
  if (requiredEquipment.length === 0) return 1; // No equipment needed = full availability
  
  let matches = 0;
  for (const req of requiredEquipment) {
    if (hasEquipment(constraints, req)) {
      matches++;
    }
  }
  
  return matches / requiredEquipment.length;
}

export function getInjuryRiskScore(constraints: TrainingConstraints): number {
  // Returns a score from 0-1 representing injury risk (0 = no injuries, 1 = serious injuries)
  if (!constraints.injuries || constraints.injuries.length === 0) return 0;
  
  const severityMap: Record<string, number> = {
    'minor': 0.3,
    'moderate': 0.7,
    'serious': 1.0
  };
  
  let maxRisk = 0;
  for (const injury of constraints.injuries) {
    const risk = severityMap[injury.severity] || 0;
    maxRisk = Math.max(maxRisk, risk);
  }
  
  return maxRisk;
}

// Validation helpers
export function validateAgainstConstraints(constraints: TrainingConstraints, requiredEquipment: string[] = []): boolean {
  // Check if constraints allow for the required equipment
  for (const req of requiredEquipment) {
    if (!hasEquipment(constraints, req)) {
      return false;
    }
  }
  
  return true;
}

// Display helpers
export function getConstraintSummary(constraints: TrainingConstraints): string {
  const parts: string[] = [];
  
  parts.push(`${getAvailableDaysCount(constraints)} days/week`);
  
  if (constraints.maxDuration) {
    parts.push(`${constraints.maxDuration}min max`);
  }
  
  if (hasInjuries(constraints)) {
    parts.push(`${constraints.injuries!.length} injury${constraints.injuries!.length !== 1 ? 'ies' : ''}`);
  }
  
  parts.push(constraints.location);
  
  return parts.join(', ');
}

// Equality
export function equals(constraints: TrainingConstraints, other: TrainingConstraints): boolean {
  if (!other) return false;

  return (
    JSON.stringify(constraints.availableDays) === JSON.stringify(other.availableDays) &&
    constraints.preferredTime === other.preferredTime &&
    constraints.maxDuration === other.maxDuration &&
    constraints.location === other.location &&
    JSON.stringify(constraints.availableEquipment) === JSON.stringify(other.availableEquipment) &&
    JSON.stringify(constraints.injuries) === JSON.stringify(other.injuries)
  );
}