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
 * Common week starting with Monday, often used for scheduling UI.
 */
export const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/**
 * Type for valid day names
 */
export type DayName = (typeof WEEK_DAYS)[number];
