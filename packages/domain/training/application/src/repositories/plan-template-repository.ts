import { Result } from '@bene/shared-domain';
import type { PlanTemplate } from '@bene/training-core';

/**
 * Repository interface for PlanTemplate entities
 *
 * Plan templates are read-mostly data stored in D1 database.
 * They represent pre-built workout plans that users can adopt.
 */
export interface PlanTemplateRepository {
  /**
   * Find a plan template by its ID
   */
  findById(templateId: string): Promise<Result<PlanTemplate>>;

  /**
   * Find featured plan templates
   * @param limit Maximum number of templates to return (default: 10)
   */
  findFeatured(limit?: number): Promise<Result<PlanTemplate[]>>;

  /**
   * Find plan templates by tags
   * @param tags Array of tags to search for
   * @param limit Maximum number of templates to return (default: 10)
   */
  findByTags(tags: string[], limit?: number): Promise<Result<PlanTemplate[]>>;

  /**
   * Search plan templates by name or description
   * @param query Search query string
   * @param limit Maximum number of templates to return (default: 10)
   */
  search(query: string, limit?: number): Promise<Result<PlanTemplate[]>>;

  /**
   * Save a plan template (create or update)
   */
  save(template: PlanTemplate): Promise<Result<void>>;

  /**
   * Delete a plan template
   */
  delete(templateId: string): Promise<Result<void>>;
}
