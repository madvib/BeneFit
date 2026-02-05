import { describe, it, expect } from 'vitest';
import { ValueObject } from './value-object.js';

// Create a concrete implementation for testing
interface TestValueObjectProps {
  name: string;
  value: number;
  tags: string[];
}

class TestValueObject extends ValueObject<TestValueObjectProps> {
  constructor(props: TestValueObjectProps) {
    super(props);
  }
}

class AnotherTestValueObject extends ValueObject<{ data: string }> {
  constructor(props: { data: string }) {
    super(props);
  }
}

describe('ValueObject', () => {
  describe('constructor', () => {
    it('should create value object with provided props', () => {
      const props: TestValueObjectProps = { name: 'test', value: 42, tags: ['a', 'b'] };
      const vo = new TestValueObject(props);

      expect(vo['props']).toEqual(props);
      expect(Object.isFrozen(vo['props'])).toBe(true);
    });

    it('should freeze the props to prevent mutation', () => {
      const props = { name: 'test', value: 42, tags: ['a', 'b'] };
      const vo = new TestValueObject(props);

      expect(() => {
        // Try to modify the frozen object - this should throw in strict mode
        Object.defineProperty(vo['props'], 'name', { value: 'changed' });
      }).toThrow(); // Should throw in strict mode since object is frozen
    });
  });

  describe('equals', () => {
    it('should return true when comparing value object to itself', () => {
      const props = { name: 'test', value: 42, tags: ['a', 'b'] };
      const vo = new TestValueObject(props);

      expect(vo.equals(vo)).toBe(true);
    });

    it('should return true when comparing value objects with same props', () => {
      const props1 = { name: 'test', value: 42, tags: ['a', 'b'] };
      const props2 = { name: 'test', value: 42, tags: ['a', 'b'] };
      const vo1 = new TestValueObject(props1);
      const vo2 = new TestValueObject(props2);

      expect(vo1.equals(vo2)).toBe(true);
      expect(vo2.equals(vo1)).toBe(true);
    });

    it('should return false when comparing value objects with different props', () => {
      const props1 = { name: 'test', value: 42, tags: ['a', 'b'] };
      const props2 = { name: 'different', value: 42, tags: ['a', 'b'] };
      const vo1 = new TestValueObject(props1);
      const vo2 = new TestValueObject(props2);

      expect(vo1.equals(vo2)).toBe(false);
      expect(vo2.equals(vo1)).toBe(false);
    });

    it('should return false when comparing to undefined', () => {
      const props = { name: 'test', value: 42, tags: ['a', 'b'] };
      const vo = new TestValueObject(props);

      expect(vo.equals(undefined)).toBe(false);
    });

    it('should return false when comparing to different type of value object', () => {
      const props = { name: 'test', value: 42, tags: ['a', 'b'] };
      const vo1 = new TestValueObject(props);
      const vo2 = new AnotherTestValueObject({ data: 'something' });

      expect(vo1.equals(vo2 as never)).toBe(false);
      expect(vo2.equals(vo1 as never)).toBe(false);
    });

    it('should handle nested objects correctly', () => {
      const props1 = {
        name: 'test',
        value: 42,
        tags: ['a', 'b'],
        nested: { a: 1, b: 2 },
      };
      const props2 = {
        name: 'test',
        value: 42,
        tags: ['a', 'b'],
        nested: { a: 1, b: 2 },
      };
      const vo1 = new TestValueObject(props1);
      const vo2 = new TestValueObject(props2);

      expect(vo1.equals(vo2)).toBe(true);
    });

    it('should return false for objects with same structure but different values', () => {
      const props1 = {
        name: 'test',
        value: 42,
        tags: ['a', 'b'],
        nested: { a: 1, b: 2 },
      };
      const props2 = {
        name: 'test',
        value: 42,
        tags: ['a', 'b'],
        nested: { a: 1, b: 3 }, // Different value
      };
      const vo1 = new TestValueObject(props1);
      const vo2 = new TestValueObject(props2);

      expect(vo1.equals(vo2)).toBe(false);
    });
  });
});
