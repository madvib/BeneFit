// domain-pattern.test.ts

import { describe, it, expect, expectTypeOf } from 'vitest';
import { z } from 'zod';

/**
 * ============================================================================
 * TEST SUITE: Domain Entity Pattern
 * ============================================================================
 * 
 * This test suite defines the canonical pattern for domain entities.
 * All edge cases and requirements should be captured here.
 */

describe('Domain Entity Pattern - Requirements', () => {

  // ============================================================================
  // 1. SCHEMA DEFINITION REQUIREMENTS
  // ============================================================================

  describe('Schema Definition', () => {
    it('should allow .pick() for factory schemas', () => {
      const BaseSchema = z.object({
        id: z.uuid(),
        name: z.string(),
        sensitive: z.string(),
      }).brand<'DOMAIN'>();

      // This should NOT cause type errors
      const CreateSchema = BaseSchema.pick({
        name: true,
      }).extend({
        id: z.uuid().optional(),
      });

      expect(CreateSchema).toBeDefined();
    });

    it('should allow .omit() for view schemas', () => {
      const BaseSchema = z.object({
        id: z.uuid(),
        name: z.string(),
        sensitive: z.string(),
      }).brand<'DOMAIN'>();

      // This should work
      const ViewSchema = BaseSchema.omit({ sensitive: true });

      expect(ViewSchema).toBeDefined();
    });

    it('should preserve type inference through .pick() and .extend()', () => {
      const BaseSchema = z.object({
        id: z.uuid(),
        name: z.string(),
      }).brand<'DOMAIN'>();

      const CreateSchema = BaseSchema.pick({
        name: true,
      }).extend({
        id: z.uuid().optional(),
      }).transform((data) => ({
        ...data,
        id: data.id || crypto.randomUUID(),
      })) satisfies z.ZodType<z.infer<typeof BaseSchema>>;

      const result = CreateSchema.parse({ name: 'test' });

      expectTypeOf(result).toHaveProperty('id');
      expectTypeOf(result).toHaveProperty('name');
    });
  });

  // ============================================================================
  // 2. BRAND ENFORCEMENT REQUIREMENTS
  // ============================================================================

  describe('Brand Enforcement', () => {
    type DomainBrand = 'DOMAIN';
    type Branded<T> = T & { __brand: DomainBrand };
    type Unbrand<T> = T extends Branded<infer U> ? U : T;

    it('should prevent branded types from being used directly in views', () => {
      type DomainEntity = Branded<{ id: string; sensitive: string }>;
      type ViewType = { id: string }; // Should NOT include sensitive

      // This should compile
      const domain: DomainEntity = { id: '1', sensitive: 'secret' } as DomainEntity;
      const view: ViewType = { id: domain.id };

      expect(view).not.toHaveProperty('sensitive');
    });

    it('should allow Unbrand only in fromPersistence', () => {
      type DomainEntity = Branded<{ id: string; data: string }>;

      function fromPersistence(data: Unbrand<DomainEntity>): DomainEntity {
        // Only legitimate use of Unbrand
        return data as DomainEntity;
      }

      const restored = fromPersistence({ id: '1', data: 'test' });
      expect(restored).toHaveProperty('id');
    });

    it('should detect nested branded types in views', () => {
      type NestedDomain = Branded<{ value: string }>;
      type ParentDomain = Branded<{ nested: NestedDomain }>;

      // View should require NestedView, not NestedDomain
      type NestedView = { value: string };
      type ParentView = { nested: NestedView };

      const domain: ParentDomain = {
        nested: { value: 'test' } as NestedDomain
      } as ParentDomain;

      const view: ParentView = {
        nested: { value: domain.nested.value }
      };

      expect(view.nested).toEqual({ value: 'test' });
    });
  });

  // ============================================================================
  // 3. FACTORY PATTERN REQUIREMENTS
  // ============================================================================

  describe('Factory Patterns', () => {
    it('should support role-based creation with shared logic', () => {
      const MessageSchema = z.object({
        id: z.uuid(),
        role: z.enum(['user', 'coach']),
        content: z.string(),
      }).brand<'DOMAIN'>();

      type Message = z.infer<typeof MessageSchema>;

      function createMessageSchema<TRole extends 'user' | 'coach'>(
        role: TRole,
        pickFields: (keyof Omit<Message, 'id' | 'role'>)[]
      ) {
        // Should be able to reuse this logic
        return MessageSchema.pick(
          Object.fromEntries(pickFields.map(k => [k, true])) as any
        ).extend({
          id: z.uuid().optional(),
        }).transform((data) => ({
          ...data,
          id: data.id || randomUUID(),
          role,
        })) satisfies z.ZodType<Message>;
      }

      const CreateUserSchema = createMessageSchema('user', ['content']);
      const CreateCoachSchema = createMessageSchema('coach', ['content']);

      expect(CreateUserSchema.parse({ content: 'test' })).toHaveProperty('role', 'user');
      expect(CreateCoachSchema.parse({ content: 'test' })).toHaveProperty('role', 'coach');
    });

    it('should handle optional fields in creation schemas', () => {
      const EntitySchema = z.object({
        id: z.uuid(),
        required: z.string(),
        optional: z.string().optional(),
        timestamp: z.date(),
      }).brand<'DOMAIN'>();

      const CreateSchema = EntitySchema.pick({
        required: true,
        optional: true,
      }).extend({
        id: z.uuid().optional(),
        timestamp: z.date().optional(),
      }).transform((data) => ({
        ...data,
        id: data.id || randomUUID(),
        timestamp: data.timestamp || new Date(),
      }));

      const result = CreateSchema.parse({ required: 'test' });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('required', 'test');
    });
  });

  // ============================================================================
  // 4. VIEW SERIALIZATION REQUIREMENTS
  // ============================================================================

  describe('View Serialization', () => {
    it('should serialize Dates to ISO strings', () => {
      type Entity = { id: string; createdAt: Date };
      type EntityView = { id: string; createdAt: string };

      const entity: Entity = {
        id: '1',
        createdAt: new Date('2024-01-01'),
      };

      function serializeForView<T extends Record<string, any>>(obj: T) {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = value instanceof Date ? value.toISOString() : value;
        }
        return result;
      }

      const view: EntityView = serializeForView(entity);

      expect(view.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expectTypeOf(view.createdAt).toBeString();
    });

    it('should map nested branded entities to views', () => {
      type ChildDomain = { value: string } & { __brand: 'DOMAIN' };
      type ParentDomain = { child: ChildDomain } & { __brand: 'DOMAIN' };

      type ChildView = { value: string };
      type ParentView = { child: ChildView };

      const toChildView = (child: ChildDomain): ChildView => ({
        value: child.value
      });

      const toParentView = (parent: ParentDomain): ParentView => ({
        child: toChildView(parent.child)
      });

      const domain: ParentDomain = {
        child: { value: 'test' } as ChildDomain
      } as ParentDomain;

      const view = toParentView(domain);

      expect(view).toEqual({ child: { value: 'test' } });
    });

    it('should handle optional nested entities', () => {
      type ChildDomain = { value: string } & { __brand: 'DOMAIN' };
      type ParentDomain = { child?: ChildDomain } & { __brand: 'DOMAIN' };

      type ChildView = { value: string };
      type ParentView = { child?: ChildView };

      const toChildView = (child: ChildDomain): ChildView => ({
        value: child.value
      });

      const toParentView = (parent: ParentDomain): ParentView => ({
        child: parent.child ? toChildView(parent.child) : undefined
      });

      const withChild: ParentDomain = {
        child: { value: 'test' } as ChildDomain
      } as ParentDomain;

      const withoutChild: ParentDomain = {} as ParentDomain;

      expect(toParentView(withChild).child).toEqual({ value: 'test' });
      expect(toParentView(withoutChild).child).toBeUndefined();
    });
  });

  // ============================================================================
  // 5. TYPE DISPLAY REQUIREMENTS (IDE Experience)
  // ============================================================================

  describe('Type Display in IDE', () => {
    it('should show branded type name, not expanded properties', () => {
      const EntitySchema = z.object({
        id: z.uuid(),
        name: z.string(),
        nested: z.object({
          value: z.string(),
        }),
      }).brand<'DOMAIN'>();

      type Entity = z.infer<typeof EntitySchema>;

      // When hovering, should show "Entity" not "{ id: string, name: string, ... }"
      // This is aspirational - may not be fully achievable
      const entity: Entity = null as any;

      expectTypeOf(entity).toHaveProperty('id');
    });
  });

  // ============================================================================
  // 6. READONLY REQUIREMENTS
  // ============================================================================

  describe('Readonly Enforcement', () => {
    it('should make domain types readonly', () => {
      const EntitySchema = z.object({
        id: z.uuid(),
        name: z.string(),
      }).brand<'DOMAIN'>();

      type Entity = Readonly<z.infer<typeof EntitySchema>>;

      const entity: Entity = { id: '1', name: 'test' } as Entity;

      // This should be a type error (but we can't test that directly)
      // entity.name = 'changed'; // Should error

      expectTypeOf(entity).toMatchTypeOf<{ readonly id: string }>();
    });
  });
});