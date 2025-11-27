import { TemplateStructure } from "../template-structure/template-structure.js";
import { TemplateRules } from "../template-rules/template-rules.js";

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

export interface WorkoutPreview {
  weekNumber: number;
  dayOfWeek: number;
  workoutSummary: string; // Human-readable preview
}

export interface PlanTemplate {
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
