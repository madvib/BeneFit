/**
 * Valid days of the week used throughout the domain.
 * Array index corresponds to JavaScript Date.getDay() values (0 = Sunday).
 */
export const VALID_DAYS: readonly string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Type for valid day names
 */
export type DayName = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
