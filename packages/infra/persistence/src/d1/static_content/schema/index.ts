/**
This database holds static resources like exercise table, plan and workout templates
 *
 */

import { planTemplates } from './plan_templates.ts';
import { templateRatings } from './template_ratings.ts';
import { templateTags } from './template_tags.ts';

export * from './plan_templates.ts';
export * from './template_ratings.ts';
export * from './template_tags.ts';

export const static_content_schema = {
  ...planTemplates,
  ...templateRatings,
  ...templateTags,
};
