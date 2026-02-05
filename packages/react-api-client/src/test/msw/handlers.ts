import { coachHandlers } from './coach-handlers.js';
import { profileHandlers } from './profile-handlers.js';
import { fitnessPlanHandlers } from './fitness-plan-handlers.js';
import { workoutHandlers } from './workout-handlers.js';
import { integrationHandlers } from './integration-handlers.js';

/**
 * All MSW handlers for mocking API
 * 
 * Import in tests or Storybook to intercept HTTP requests
 */
export const handlers = [
  ...coachHandlers,
  ...profileHandlers,
  ...fitnessPlanHandlers,
  ...workoutHandlers,
  ...integrationHandlers,
];

// Re-export individual domain handlers for targeted usage
export { coachHandlers } from './coach-handlers.js';
export { profileHandlers } from './profile-handlers.js';
export { fitnessPlanHandlers } from './fitness-plan-handlers.js';
export { workoutHandlers } from './workout-handlers.js';
export { integrationHandlers } from './integration-handlers.js';

// Re-export scenarios
export * from './coach-handlers.js';
export * from './explore-handlers.js';
export * from './fitness-plan-handlers.js';
export * from './profile-handlers.js';
export * from './workout-handlers.js';
export * from './integration-handlers.js';
