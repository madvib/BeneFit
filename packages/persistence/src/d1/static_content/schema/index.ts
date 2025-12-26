/**
This database holds static resources like exercise table, plan and workout templates
 *
 */

import { planTemplates } from './plan_templates.js';
import { templateRatings } from './template_ratings.js';
import { templateTags } from './template_tags.js';

export * from './plan_templates.js';
export * from './template_ratings.js';
export * from './template_tags.js';

export const static_content_schema = {
  planTemplates,
  templateRatings,
  templateTags,
};
