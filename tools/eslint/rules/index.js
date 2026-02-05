import { create, meta } from './require-colocated-tests.js';

// Rule definitions for plugin registration
export const rules = {
  'require-colocated-tests': { create, meta },
};

// Rule configurations to be spread into the rules object
export const configs = {
  'custom/require-colocated-tests': ['warn', { create, meta }],
  'no-restricted-syntax': [
    'error',
    {
      selector:
        'JSXAttribute[name.name="className"] Literal[value=/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/]',
      message: 'Use typography constants from typography.ts instead',
    },
    {
      selector:
        'JSXAttribute[name.name="className"] Literal[value=/font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/]',
      message: 'Use typography constants from typography.ts instead',
    },
  ],
};

export default { rules, configs };
