import { user_profile_schema } from './user-profile/index';
import { coach_schema } from './coach/index';
import { workouts_schema } from './workouts/index';
import { integrations_schema } from './integrations/index';
import { fitness_plan_schema } from './fitness-plan/index';

export * from './user-profile/index';
export * from './coach/index';
export * from './workouts/index';
export * from './integrations/index';
export * from './fitness-plan/index';

export const user_do_schema = {
  ...user_profile_schema,
  ...coach_schema,
  ...workouts_schema,
  ...integrations_schema,
  ...fitness_plan_schema,
};
