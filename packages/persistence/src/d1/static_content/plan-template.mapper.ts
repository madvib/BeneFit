// import type {
//   PlanTemplate,
//   TemplateStructure,
//   TemplateRules,
//   WorkoutPreview,
// } from '@bene/training-core';
// import type {
//   NewPlanTemplate,
//   PlanTemplate as DbPlanTemplate,
// } from '@bene/persistence';

// // Helper to extract queryable fields from structure
// function extractStructureMetrics(structure: TemplateStructure) {
//   const duration = structure.duration;
//   const frequency = structure.frequency;

//   return {
//     durationType: duration.type,
//     durationWeeksMin: duration.type === 'fixed' ? duration.weeks : duration.min,
//     durationWeeksMax: duration.type === 'fixed' ? duration.weeks : duration.max,

//     frequencyType: frequency.type,
//     workoutsPerWeekMin:
//       frequency.type === 'fixed' ? frequency.workoutsPerWeek : frequency.min,
//     workoutsPerWeekMax:
//       frequency.type === 'fixed' ? frequency.workoutsPerWeek : frequency.max,
//   };
// }

// // Domain to Database
// export function toDatabase(template: PlanTemplate): NewPlanTemplate {
//   const structureMetrics = extractStructureMetrics(template.structure);

//   return {
//     id: template.id,
//     name: template.name,
//     description: template.description || null,

//     // Author
//     authorUserId: template.author.userId || null,
//     authorName: template.author.name,
//     authorCredentials: template.author.credentials || null,

//     // Extracted for querying
//     minExperienceLevel: template.rules.minExperienceLevel,
//     maxExperienceLevel: template.rules.maxExperienceLevel,

//     durationType: structureMetrics.durationType,
//     durationWeeksMin: structureMetrics.durationWeeksMin,
//     durationWeeksMax: structureMetrics.durationWeeksMax,

//     frequencyType: structureMetrics.frequencyType,
//     workoutsPerWeekMin: structureMetrics.workoutsPerWeekMin,
//     workoutsPerWeekMax: structureMetrics.workoutsPerWeekMax,

//     tags: template.tags as any,
//     requiredEquipment: (template.rules.requiredEquipment || null) as any,

//     // Full data as JSON (source of truth)
//     structureJson: template.structure as any,
//     rulesJson: template.rules as any,

//     // Metadata
//     isPublic: template.metadata.isPublic,
//     isFeatured: template.metadata.isFeatured,
//     isVerified: template.metadata.isVerified,

//     ratingAverage: template.metadata.rating || null,
//     ratingCount: 0, // This should come from a ratings table actually
//     usageCount: template.metadata.usageCount,

//     version: template.version,

//     previewWorkouts: (template.previewWorkouts || null) as any,

//     createdAt: template.metadata.createdAt,
//     updatedAt: template.metadata.updatedAt,
//     publishedAt: template.metadata.publishedAt || null,
//   };
// }

// // Database to Domain
// export function toDomain(row: DbPlanTemplate): PlanTemplate {
//   return {
//     id: row.id,
//     name: row.name,
//     description: row.description || '',

//     author: {
//       userId: row.authorUserId || undefined,
//       name: row.authorName,
//       credentials: row.authorCredentials || undefined,
//     },

//     tags: row.tags as string[],

//     // Source of truth from JSON
//     structure: row.structureJson as TemplateStructure,
//     rules: row.rulesJson as TemplateRules,

//     metadata: {
//       isPublic: row.isPublic,
//       isFeatured: row.isFeatured,
//       isVerified: row.isVerified,
//       rating: row.ratingAverage || undefined,
//       usageCount: row.usageCount,
//       createdAt: row.createdAt,
//       updatedAt: row.updatedAt,
//       publishedAt: row.publishedAt || undefined,
//     },

//     previewWorkouts: (row.previewWorkouts as WorkoutPreview[]) || undefined,

//     version: row.version,
//   };
// }
