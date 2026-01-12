import customRules from './rules/index.js';
import configs from './configs/index.js';

const plugin = {
  meta: {
    name: 'bene-eslint-plugin',
    version: '0.0.1',
  },
  configs,
  rules: customRules.rules, // Use the rules property from the export
  processors: {},
};

export default plugin;
