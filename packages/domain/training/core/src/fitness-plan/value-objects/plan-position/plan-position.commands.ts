import { PlanPosition } from './plan-position.types.js';
import { VALID_DAYS } from '../../constants.js';

// Navigation
export function advanceDay(position: PlanPosition): PlanPosition {
  if (position.day < 6) {
    return {
      week: position.week,
      day: position.day + 1,
    };
  }

  return {
    week: position.week + 1,
    day: 0,
  };
}

export function advanceDays(position: PlanPosition, days: number): PlanPosition {
  if (days < 0) {
    return position; // Can't go backwards
  }

  let result: PlanPosition = position;
  for (let i = 0; i < days; i++) {
    result = advanceDay(result);
  }

  return result;
}

export function advanceWeek(position: PlanPosition): PlanPosition {
  return {
    week: position.week + 1,
    day: position.day, // Keep same day of week
  };
}

export function advanceWeeks(position: PlanPosition, weeks: number): PlanPosition {
  if (weeks < 0) {
    return position;
  }

  return {
    week: position.week + weeks,
    day: position.day,
  };
}

export function goToNextMonday(position: PlanPosition): PlanPosition {
  // Monday is day 1
  const daysUntilMonday = position.day === 0 ? 1 : (8 - position.day);
  return advanceDays(position, daysUntilMonday);
}

export function goToStartOfWeek(position: PlanPosition): PlanPosition {
  return {
    week: position.week,
    day: 0,
  };
}

export function goToEndOfWeek(position: PlanPosition): PlanPosition {
  return {
    week: position.week,
    day: 6,
  };
}

// Comparisons
export function isBefore(position: PlanPosition, other: PlanPosition): boolean {
  if (position.week < other.week) {
    return true;
  }

  if (position.week === other.week) {
    return position.day < other.day;
  }

  return false;
}

export function isAfter(position: PlanPosition, other: PlanPosition): boolean {
  if (position.week > other.week) {
    return true;
  }

  if (position.week === other.week) {
    return position.day > other.day;
  }

  return false;
}

export function isSamePosition(position: PlanPosition, other: PlanPosition): boolean {
  return position.week === other.week && position.day === other.day;
}

export function isSameWeek(position: PlanPosition, other: PlanPosition): boolean {
  return position.week === other.week;
}

export function isSameDay(position: PlanPosition, other: PlanPosition): boolean {
  return position.day === other.day;
}

export function isStartOfWeek(position: PlanPosition): boolean {
  return position.day === 0;
}

export function isEndOfWeek(position: PlanPosition): boolean {
  return position.day === 6;
}

// Distance calculations
export function daysUntil(position: PlanPosition, other: PlanPosition): number {
  // Calculate total days from start for each position
  const thisTotalDays = (position.week - 1) * 7 + position.day;
  const otherTotalDays = (other.week - 1) * 7 + other.day;

  return otherTotalDays - thisTotalDays;
}

export function weeksUntil(position: PlanPosition, other: PlanPosition): number {
  return Math.floor(daysUntil(position, other) / 7);
}

export function isWithinDays(position: PlanPosition, other: PlanPosition, days: number): boolean {
  const distance = Math.abs(daysUntil(position, other));
  return distance <= days;
}

export function isWithinWeeks(position: PlanPosition, other: PlanPosition, weeks: number): boolean {
  const distance = Math.abs(weeksUntil(position, other));
  return distance <= weeks;
}

export function getDayName(position: PlanPosition): string {
  const dayIndex = position.day;
  if (dayIndex < 0 || dayIndex > 6) {
    throw new Error(`Invalid day index: ${dayIndex}. Must be between 0 and 6.`);
  }
  return VALID_DAYS[dayIndex]!;
}

export function isWeekday(position: PlanPosition): boolean {
  return position.day >= 1 && position.day <= 5;
}

export function isWeekend(position: PlanPosition): boolean {
  return position.day === 0 || position.day === 6;
}

// Display helpers
export function toString(position: PlanPosition): string {
  return `Week ${position.week}, Day ${position.day} (${getDayName(position)})`;
}

export function toShortString(position: PlanPosition): string {
  return `W${position.week}D${position.day}`;
}

export function getDisplayInfo(position: PlanPosition): {
  week: number;
  day: number;
  dayName: string;
  isWeekend: boolean;
} {
  return {
    week: position.week,
    day: position.day,
    dayName: getDayName(position),
    isWeekend: isWeekend(position),
  };
}

// Equality
export function equals(position: PlanPosition, other: PlanPosition): boolean {
  if (!other) return false;
  return isSamePosition(position, other);
}