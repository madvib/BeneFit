import { user_profile_schema } from './user-profile/index.js';
import { coach_schema } from './coach/index.js';
import { workouts_schema } from './workouts/index.js';
import { integrations_schema } from './integrations/index.js';
import { fitness_plan_schema } from './fitness-plan/index.js';

export * from './user-profile/index.js';
export * from './coach/index.js';
export * from './workouts/index.js';
export * from './integrations/index.js';
export * from './fitness-plan/index.js';

export const user_do_schema = {
  ...user_profile_schema,
  ...coach_schema,
  ...workouts_schema,
  ...integrations_schema,
  ...fitness_plan_schema,
};
