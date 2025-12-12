/**
This database holds static resources like exercise table, plan and workout templates
 *
 */

import { planTemplates } from './plan_templates';
import { templateRatings } from './template_ratings';
import { templateTags } from './template_tags';

export * from './plan_templates';
export * from './template_ratings';
export * from './template_tags';

export const static_content_schema = {
  ...planTemplates,
  ...templateRatings,
  ...templateTags,
};
