// import { eq, sql, desc, and, ilike } from 'drizzle-orm';
// import { DrizzleD1Database } from 'drizzle-orm/d1/driver.js';
// import {
//   Result,
//   EntityNotFoundError,
//   QueryError,
//   SaveError,
//   DeleteError,
// } from '@bene/shared';
// import type { PlanTemplate } from '@bene/training-core';
// import type { PlanTemplateRepository } from '@bene/training-application';
// import { toDatabase, toDomain } from './plan-template.mapper.js';

// import { planTemplates } from '@bene/persistence';
// export class D1PlanTemplateRepository implements PlanTemplateRepository {
//   constructor(private db: DrizzleD1Database) {}

//   async findById(templateId: string): Promise<Result<PlanTemplate>> {
//     try {
//       const row = await this.db
//         .select()
//         .from(planTemplates)
//         .where(eq(planTemplates.id, templateId))
//         .limit(1);

//       if (row.length === 0) {
//         return Result.fail(new EntityNotFoundError('PlanTemplate', templateId));
//       }

//       const template = toDomain(row[0]!);
//       return Result.ok(template);
//     } catch (error) {
//       return Result.fail(
//         new QueryError(
//           'find',
//           'PlanTemplate',
//           error instanceof Error ? error : undefined,
//         ),
//       );
//     }
//   }

//   async findFeatured(limit = 10): Promise<Result<PlanTemplate[]>> {
//     try {
//       const rows = await this.db
//         .select()
//         .from(planTemplates)
//         .where(eq(planTemplates.isFeatured, true))
//         .orderBy(desc(planTemplates.ratingAverage))
//         .limit(limit);

//       const templates = rows.map((row) => toDomain(row));
//       return Result.ok(templates);
//     } catch (error) {
//       return Result.fail(
//         new QueryError(
//           'find featured',
//           'PlanTemplates',
//           error instanceof Error ? error : undefined,
//         ),
//       );
//     }
//   }

//   async findByTags(tags: string[], limit = 10): Promise<Result<PlanTemplate[]>> {
//     try {
//       const rows = await this.db
//         .select()
//         .from(planTemplates)
//         .where(
//           and(
//             eq(planTemplates.isPublic, true),
//             sql`${planTemplates.tags} @> ${JSON.stringify(tags)}`,
//           ),
//         )
//         .orderBy(desc(planTemplates.usageCount))
//         .limit(limit);

//       const templates = rows.map((row) => toDomain(row));
//       return Result.ok(templates);
//     } catch (error) {
//       return Result.fail(
//         new QueryError(
//           'find by tags',
//           'PlanTemplates',
//           error instanceof Error ? error : undefined,
//         ),
//       );
//     }
//   }

//   async search(query: string, limit = 10): Promise<Result<PlanTemplate[]>> {
//     try {
//       const rows = await this.db
//         .select()
//         .from(planTemplates)
//         .where(
//           and(
//             eq(planTemplates.isPublic, true),
//             ilike(planTemplates.name, `%${query}%`),
//           ),
//         )
//         .orderBy(desc(planTemplates.usageCount))
//         .limit(limit);

//       const templates = rows.map((row) => toDomain(row));
//       return Result.ok(templates);
//     } catch (error) {
//       return Result.fail(
//         new QueryError(
//           'search',
//           'PlanTemplates',
//           error instanceof Error ? error : undefined,
//         ),
//       );
//     }
//   }

//   async save(template: PlanTemplate): Promise<Result<void>> {
//     try {
//       const row = toDatabase(template);

//       await this.db.insert(planTemplates).values(row).onConflictDoUpdate({
//         target: planTemplates.id,
//         set: row,
//       });

//       return Result.ok();
//     } catch (error) {
//       return Result.fail(
//         new SaveError(
//           'PlanTemplate',
//           template.id,
//           error instanceof Error ? error : undefined,
//         ),
//       );
//     }
//   }

//   async delete(templateId: string): Promise<Result<void>> {
//     try {
//       await this.db.delete(planTemplates).where(eq(planTemplates.id, templateId));

//       return Result.ok();
//     } catch (error) {
//       return Result.fail(
//         new DeleteError(
//           'PlanTemplate',
//           templateId,
//           error instanceof Error ? error : undefined,
//         ),
//       );
//     }
//   }
// }
