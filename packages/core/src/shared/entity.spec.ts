import { describe, it, expect } from 'vitest';
import { Entity } from './entity';

// Create a concrete implementation for testing
interface TestEntityProps {
  name: string;
  value: number;
}

class TestEntity extends Entity<TestEntityProps> {
  constructor(props: TestEntityProps, id: string) {
    super(props, id);
  }
}

describe('Entity', () => {
  describe('constructor', () => {
    it('should create entity with provided props and id', () => {
      const props = { name: 'test', value: 42 };
      const id = '123';
      const entity = new TestEntity(props, id);

      expect(entity.id).toBe(id);
      expect(entity['props']).toBe(props);
      expect(entity['props'].name).toBe('test');
      expect(entity['props'].value).toBe(42);
    });
  });

  describe('equals', () => {
    it('should return true when comparing entity to itself', () => {
      const props = { name: 'test', value: 42 };
      const id = '123';
      const entity = new TestEntity(props, id);

      expect(entity.equals(entity)).toBe(true);
    });

    it('should return true when comparing entities with same id', () => {
      const props1 = { name: 'test1', value: 42 };
      const props2 = { name: 'test2', value: 99 }; // Different props but same id
      const id = '123';
      const entity1 = new TestEntity(props1, id);
      const entity2 = new TestEntity(props2, id);

      expect(entity1.equals(entity2)).toBe(true);
      expect(entity2.equals(entity1)).toBe(true);
    });

    it('should return false when comparing entity to undefined', () => {
      const props = { name: 'test', value: 42 };
      const id = '123';
      const entity = new TestEntity(props, id);

      expect(entity.equals(undefined)).toBe(false);
    });

    it('should return false when comparing entities with different ids', () => {
      const props1 = { name: 'test', value: 42 };
      const props2 = { name: 'test', value: 42 };
      const entity1 = new TestEntity(props1, '123');
      const entity2 = new TestEntity(props2, '456');

      expect(entity1.equals(entity2)).toBe(false);
      expect(entity2.equals(entity1)).toBe(false);
    });
  });
});