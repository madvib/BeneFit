import { CreateView } from '@bene/shared';
import { WorkoutPreview } from '../../../../value-objects/workout-preview/index.js';
import { TemplateStructure, TemplateStructureView } from '../template-structure/index.js';
import { TemplateRules, TemplateRulesView } from '../template-rules/index.js';

export interface TemplateAuthor {
  userId?: string;
  name: string;
  credentials?: string; // e.g., "NASM-CPT, CSCS"
}

export interface TemplateMetadata {
  isPublic: boolean;
  isFeatured: boolean;
  isVerified: boolean; // Verified by BeneFit team
  rating?: number; // 0-5
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

interface PlanTemplateData {
  id: string;
  name: string;
  description: string;
  author: TemplateAuthor;
  tags: string[]; // e.g., ["strength", "hypertrophy", "beginner"]

  structure: TemplateStructure;
  rules: TemplateRules;

  metadata: TemplateMetadata;
  previewWorkouts?: WorkoutPreview[];

  // Versioning
  version: number;
}

export type PlanTemplate = Readonly<PlanTemplateData>;

// View Interface

export type PlanTemplateView = CreateView<
  PlanTemplate,
  'structure' | 'rules',
  {
    structure: TemplateStructureView;
    rules: TemplateRulesView;
    // Computed fields
    estimatedDuration: {
      minWeeks: number;
      maxWeeks: number;
    };
    frequency: {
      minWorkouts: number;
      maxWorkouts: number;
    };
  }
>;
