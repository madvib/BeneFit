export const SUPPORTED_EQUIPMENT = [
  'Dumbbells',
  'Barbell',
  'Kettlebell',
  'Pull-up Bar',
  'Resistance Bands',
  'Bench',
  'Squat Rack',
  'Cable Machine',
  'Bodyweight Only',
] as const;

export type SupportedEquipment = (typeof SUPPORTED_EQUIPMENT)[number];
