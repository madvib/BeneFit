import { userProfileSchema } from './user-profile/index';
import { coachSchema } from './coach/index';
import { workoutsSchema } from './workouts/index';
import { integrationsSchema } from './integrations/index';
import { fitnessPlanSchema } from './fitness-plan/index';

export * from './user-profile/index';
export * from './coach/index';
export * from './workouts/index';
export * from './integrations/index';
export * from './fitness-plan/index';

export const user_do_schema = {
  ...userProfileSchema,
  ...coachSchema,
  ...workoutsSchema,
  ...integrationsSchema,
  ...fitnessPlanSchema,
};
