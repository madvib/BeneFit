import { user_profile_schema } from './user-profile/index.ts';
import { coach_schema } from './coach/index.ts';
import { workouts_schema } from './workouts/index.ts';
import { integrations_schema } from './integrations/index.ts';
import { fitness_plan_schema } from './fitness-plan/index.ts';

export * from './user-profile/index.ts';
export * from './coach/index.ts';
export * from './workouts/index.ts';
export * from './integrations/index.ts';
export * from './fitness-plan/index.ts';

export const user_do_schema = {
  ...user_profile_schema,
  ...coach_schema,
  ...workouts_schema,
  ...integrations_schema,
  ...fitness_plan_schema,
};
