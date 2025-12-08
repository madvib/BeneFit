import { userProfileSchema } from './user-profile/index.js';
import { coachSchema } from './coach/index.js';
import { workoutsSchema } from './workouts/index.js';
import { integrationsSchema } from './integrations/index.js';
import { fitnessPlanSchema } from './fitness-plan/index.js';

export * from './user-profile/index.js';
export * from './coach/index.js';
export * from './workouts/index.js';
export * from './integrations/index.js';
export * from './fitness-plan/index.js';

export const user_do_schema = {
  ...userProfileSchema,
  ...coachSchema,
  ...workoutsSchema,
  ...integrationsSchema,
  ...fitnessPlanSchema,
};
