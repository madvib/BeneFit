import { describe, it, expect, beforeAll } from 'vitest';
import { publishTemplate } from '../plan-template.commands.js';
import { CreatePlanTemplateSchema, createTemplateRevision } from '../plan-template.factory.js';
import { createPlanTemplateFixture } from './plan-template.fixtures.js';
import { createTemplateStructureFixture } from '../../template-structure/index.js';
import { createTemplateRulesFixture } from '../../template-rules/index.js';
import type { TemplateStructure } from '../../template-structure/index.js';
import type { TemplateRules } from '../../template-rules/index.js';

describe('PlanTemplate', () => {
  // Shared valid structure and rules for validation tests
  let validStructure: TemplateStructure;
  let validRules: TemplateRules;

  beforeAll(() => {
    validStructure = createTemplateStructureFixture();
    validRules = createTemplateRulesFixture();
  });

  describe('creation', () => {
    it('should create valid template with version 1 and default metadata', () => {
      // Arrange & Act
      const template = createPlanTemplateFixture();

      // Assert
      expect(template.version).toBe(1);
      expect(template.metadata.isPublic).toBe(true); // Fixture default
      expect(template.metadata.usageCount).toBeGreaterThanOrEqual(0);
      expect(template.id).toBeDefined();
      expect(template.name).toBeDefined();
      expect(template.description).toBeDefined();
    });

    it('should fail with validation error when name is empty', () => {
      // Arrange
      const input = {
        name: '',
        description: 'Test description',
        author: { name: 'Coach', userId: '550e8400-e29b-41d4-a716-446655440000' },
        tags: [],
        structure: validStructure,
        rules: validRules,
      };

      // Act
      const parseResult = CreatePlanTemplateSchema.safeParse(input);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail with validation error when description is empty', () => {
      // Arrange
      const input = {
        name: 'Test Plan',
        description: '',
        author: { name: 'Coach', userId: '550e8400-e29b-41d4-a716-446655440000' },
        tags: [],
        structure: validStructure,
        rules: validRules,
      };

      // Act
      const parseResult = CreatePlanTemplateSchema.safeParse(input);

      // Assert
      expect(parseResult.success).toBe(false);
    });
  });

  describe('publishing', () => {
    it('should transition unpublished template to published state', () => {
      // Arrange
      const template = createPlanTemplateFixture({
        metadata: {
          isPublic: false,
          isFeatured: false,
          isVerified: false,
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: undefined,
        }
      });

      // Act
      const result = publishTemplate(template);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value.metadata.isPublic).toBe(true);
      expect(result.value.metadata.publishedAt).toBeDefined();
      expect(result.value.metadata.publishedAt).toBeInstanceOf(Date);
    });

    it('should fail to publish already published template with descriptive error', () => {
      // Arrange
      const template = createPlanTemplateFixture(); // Already published by default

      // Act
      const result = publishTemplate(template);

      // Assert
      expect(result.isFailure).toBe(true);
      expect(String(result.error)).toContain('already published');
    });

    it('should update updatedAt timestamp when publishing', () => {
      // Arrange
      const template = createPlanTemplateFixture({
        metadata: {
          isPublic: false,
          isFeatured: false,
          isVerified: false,
          usageCount: 0,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          publishedAt: undefined,
        }
      });

      // Act
      const result = publishTemplate(template);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value.metadata.updatedAt.getTime()).toBeGreaterThan(
        template.metadata.updatedAt.getTime()
      );
    });
  });

  describe('revisions', () => {
    it('should create revision with incremented version number', () => {
      // Arrange
      const template = createPlanTemplateFixture();

      // Act
      const result = createTemplateRevision(template, { name: 'Updated Plan' });

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value.version).toBe(template.version + 1);
    });

    it('should update name when creating revision with new name', () => {
      // Arrange
      const template = createPlanTemplateFixture();
      const newName = 'Updated Plan Name';

      // Act
      const revision = createTemplateRevision(template, { name: newName }).value;

      // Assert
      expect(revision.name).toBe(newName);
    });

    it('should reset publication status when creating revision', () => {
      // Arrange
      const template = createPlanTemplateFixture();

      // Act
      const revision = createTemplateRevision(template, {}).value;

      // Assert
      expect(revision.metadata.isPublic).toBe(false);
      expect(revision.metadata.publishedAt).toBeUndefined();
    });

    it('should preserve unchanged properties when creating revision', () => {
      // Arrange
      const template = createPlanTemplateFixture({
        name: 'Original Name',
        description: 'Original Description',
        tags: ['strength', 'endurance']
      });

      // Act
      const revision = createTemplateRevision(template, {
        name: 'Updated Name'
      }).value;

      // Assert
      expect(revision.description).toBe(template.description);
      expect(revision.tags).toEqual(template.tags);
      expect(revision.author).toEqual(template.author);
      expect(revision.structure).toEqual(template.structure);
      expect(revision.rules).toEqual(template.rules);
    });

    it('should allow partial updates when creating revision', () => {
      // Arrange
      const template = createPlanTemplateFixture({
        name: 'Original',
        tags: ['strength']
      });

      // Act
      const revision = createTemplateRevision(template, {
        name: 'Updated',
        tags: ['strength', 'cardio']
      }).value;

      // Assert
      expect(revision.name).toBe('Updated');
      expect(revision.tags).toEqual(['strength', 'cardio']);
      expect(revision.description).toBe(template.description);
    });

    it('should update timestamps when creating revision', () => {
      // Arrange
      const template = createPlanTemplateFixture();

      // Act
      const revision = createTemplateRevision(template, {}).value;

      // Assert
      expect(revision.metadata.createdAt).toBeInstanceOf(Date);
      expect(revision.metadata.updatedAt).toBeInstanceOf(Date);
      expect(revision.metadata.createdAt.getTime()).toBeGreaterThanOrEqual(
        template.metadata.updatedAt.getTime()
      );
    });
  });
});
