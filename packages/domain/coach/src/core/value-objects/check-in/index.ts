// Export all parts of the CheckIn value object
export type {
  CheckInType,
  CheckInTrigger,
  CheckInData,
  CheckIn,
} from './check-in.types.js';

export { createCheckIn } from './check-in.factory.js';
export * from './check-in.presentation.js';
export { createCheckInFixture } from './test/check-in.fixtures.js';
