// Type definitions for fixture layer
// This ensures TypeScript can resolve @bene/react-api-client/fixtures

export * from './coach';
export * from './training';
export * from './integrations';
export * from './explore';

import * as coach from './coach';
import * as training from './training';
import * as integrations from './integrations';
import * as explore from './explore';

export declare const fixtures: {
  coach: typeof coach;
  training: typeof training;
  integrations: typeof integrations;
  explore: typeof explore;
};
