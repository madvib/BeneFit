import { userProfileSchema } from './user-profile/index.ts';
import { coachSchema } from './coach/index.ts';
import { workoutsSchema } from './workouts/index.ts';
import { integrationsSchema } from './integrations/index.ts';
import { fitnessPlanSchema } from './fitness-plan/index.ts';

export * from './user-profile/index.ts';
export * from './coach/index.ts';
export * from './workouts/index.ts';
export * from './integrations/index.ts';
export * from './fitness-plan/index.ts';

export const user_do_schema = {
  ...userProfileSchema,
  ...coachSchema,
  ...workoutsSchema,
  ...integrationsSchema,
  ...fitnessPlanSchema,
};
