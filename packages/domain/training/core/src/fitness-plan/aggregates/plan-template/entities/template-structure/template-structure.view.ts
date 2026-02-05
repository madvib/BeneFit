import { serializeForView } from '@bene/shared';
import { TemplateStructure } from './template-structure.types.js';

export type TemplateStructureView = TemplateStructure;

export function toTemplateStructureView(structure: TemplateStructure): TemplateStructureView {
  return serializeForView(structure)

}
