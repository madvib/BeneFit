import { serializeForView } from '@bene/shared';
import { ActivityStructure, ActivityStructureView } from './activity-structure.types.js';

export function toActivityStructureView(structure: ActivityStructure): ActivityStructureView {
  return serializeForView(structure);
}
