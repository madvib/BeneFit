import { eq, sql, desc, and, ilike } from 'drizzle-orm';
import { Result } from '@bene/domain';
import type { PlanTemplate } from '@bene/domain/planning';
import type { PlanTemplateRepository } from '@bene/application/planning';
import type { DbClient } from '@bene/database';
import { planTemplates } from '@bene/database/schema';

export class D1PlanTemplateRepository implements PlanTemplateRepository {
  constructor(private db: DbClient) {}

  async findById(templateId: string): Promise<Result<PlanTemplate>> {
    try {
      const row = await this.db
        .select()
        .from(planTemplates)
        .where(eq(planTemplates.id, templateId))
        .limit(1);

      if (row.length === 0) {
        return Result.fail(`Plan template ${templateId} not found`);
      }

      const template = this.toDomain(row[0]);
      return Result.ok(template);
    } catch (error) {
      return Result.fail(`Failed to find plan template: ${error}`);
    }
  }

  async findFeatured(limit = 10): Promise<Result<PlanTemplate[]>> {
    try {
      const rows = await this.db
        .select()
        .from(planTemplates)
        .where(eq(planTemplates.isFeatured, true))
        .orderBy(desc(planTemplates.rating))
        .limit(limit);

      const templates = rows.map(row => this.toDomain(row));
      return Result.ok(templates);
    } catch (error) {
      return Result.fail(`Failed to find featured plan templates: ${error}`);
    }
  }

  async findByTags(tags: string[], limit = 10): Promise<Result<PlanTemplate[]>> {
    try {
      // For simplicity, we'll search for templates that have any of the tags
      // In a real implementation, this might involve more complex tag matching
      const rows = await this.db
        .select()
        .from(planTemplates)
        .where(
          and(
            eq(planTemplates.isPublic, true),
            sql`${planTemplates.tags} @> ${JSON.stringify(tags)}` // PostgreSQL JSON containment operator
          )
        )
        .orderBy(desc(planTemplates.usageCount))
        .limit(limit);

      const templates = rows.map(row => this.toDomain(row));
      return Result.ok(templates);
    } catch (error) {
      return Result.fail(`Failed to find plan templates by tags: ${error}`);
    }
  }

  async search(query: string, limit = 10): Promise<Result<PlanTemplate[]>> {
    try {
      const rows = await this.db
        .select()
        .from(planTemplates)
        .where(
          and(
            eq(planTemplates.isPublic, true),
            ilike(planTemplates.name, `%${query}%`)
          )
        )
        .orderBy(desc(planTemplates.usageCount))
        .limit(limit);

      const templates = rows.map(row => this.toDomain(row));
      return Result.ok(templates);
    } catch (error) {
      return Result.fail(`Failed to search plan templates: ${error}`);
    }
  }

  async save(template: PlanTemplate): Promise<Result<void>> {
    try {
      const row = this.toDatabase(template);

      // Upsert
      await this.db.insert(planTemplates).values(row).onConflictDoUpdate({
        target: planTemplates.id,
        set: row,
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to save plan template: ${error}`);
    }
  }

  async delete(templateId: string): Promise<Result<void>> {
    try {
      await this.db
        .delete(planTemplates)
        .where(eq(planTemplates.id, templateId));

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to delete plan template: ${error}`);
    }
  }

  // MAPPERS

  private toDomain(row: typeof planTemplates.$inferSelect): PlanTemplate {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      author: {
        userId: row.authorUserId || undefined,
        name: row.authorName,
        credentials: row.authorCredentials || undefined,
      },
      tags: row.tags as string[],
      structure: row.structure as any, // Placeholder for actual structure type
      rules: row.rules as any, // Placeholder for actual rules type
      isPublic: row.isPublic,
      isFeatured: row.isFeatured,
      isVerified: row.isVerified,
      rating: row.rating || 0,
      usageCount: row.usageCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      publishedAt: row.publishedAt || undefined,
    };
  }

  private toDatabase(template: PlanTemplate): typeof planTemplates.$inferInsert {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      authorUserId: template.author.userId,
      authorName: template.author.name,
      authorCredentials: template.author.credentials,
      tags: template.tags,
      structure: template.structure as any,
      rules: template.rules as any,
      isPublic: template.isPublic,
      isFeatured: template.isFeatured,
      isVerified: template.isVerified,
      rating: template.rating,
      usageCount: template.usageCount,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      publishedAt: template.publishedAt,
    };
  }
}