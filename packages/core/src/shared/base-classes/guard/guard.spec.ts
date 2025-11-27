import { Guard } from './guard.js'; // Adjust path as necessary
import { Result } from '../result/result.js'; // Adjust path as necessary

describe('Guard', () => {
  
  // --- 1. combine ---
  describe('combine', () => {
    it('should return OK if all results are OK', () => {
      const results = [Result.ok(), Result.ok()];
      const combined = Guard.combine(results);
      expect(combined.isFailure).toBe(false);
    });

    it('should return the first failure if one fails', () => {
      const results = [
        Result.ok(), 
        Result.fail(new Error('first error')),
        Result.fail(new Error('second error'))
      ];
      const combined = Guard.combine(results);
      expect(combined.isFailure).toBe(true);
      expect(combined.error.message).toBe('first error'); // Assuming Result.fail stores error string/obj
    });
  });

  // --- 2. againstNullOrUndefined ---
  describe('againstNullOrUndefined', () => {
    it('should return OK for a valid value', () => {
      const result = Guard.againstNullOrUndefined(1, 'param');
      expect(result.isFailure).toBe(false);
    });

    it('should fail for null', () => {
      const result = Guard.againstNullOrUndefined(null, 'param');
      expect(result.isFailure).toBe(true);
      expect(result.error.message).toContain('is null or undefined');
    });

    it('should fail for undefined', () => {
      const result = Guard.againstNullOrUndefined(undefined, 'param');
      expect(result.isFailure).toBe(true);
    });
  });

  // --- 3. againstNullOrUndefinedBulk ---
  describe('againstNullOrUndefinedBulk', () => {
    it('should return OK if all arguments are defined', () => {
      const args = [
        { argument: 'test', argumentName: 'arg1' },
        { argument: 123, argumentName: 'arg2' },
      ];
      const result = Guard.againstNullOrUndefinedBulk(args);
      expect(result.isFailure).toBe(false);
    });

    it('should fail if any argument is null', () => {
      const args = [
        { argument: 'test', argumentName: 'arg1' },
        { argument: null, argumentName: 'arg2' },
      ];
      const result = Guard.againstNullOrUndefinedBulk(args);
      expect(result.isFailure).toBe(true);
      expect(result.error.message).toContain('arg2 is null or undefined');
    });
  });

  // --- 4. againstEmptyString ---
  describe('againstEmptyString', () => {
    it('should return OK for a non-empty string', () => {
      const result = Guard.againstEmptyString('hello', 'param');
      expect(result.isFailure).toBe(false);
    });

    it('should fail for an empty string', () => {
      const result = Guard.againstEmptyString('', 'param');
      expect(result.isFailure).toBe(true);
      expect(result.error.message).toContain('is empty');
    });
    
    // Edge case: Checks strictly for empty string, not null/undefined
    it('should return OK for null (as it is not strictly empty string)', () => {
        // Note: Usually you combine this with againstNullOrUndefined
        const result = Guard.againstEmptyString(null, 'param'); 
        expect(result.isFailure).toBe(false);
    });
  });

  // --- 5. againstTooLong (NEW) ---
  describe('againstTooLong', () => {
    it('should return OK if string is within max length', () => {
      const result = Guard.againstTooLong('abc', 5, 'param');
      expect(result.isFailure).toBe(false);
    });

    it('should return OK if string is exactly max length', () => {
      const result = Guard.againstTooLong('abcde', 5, 'param');
      expect(result.isFailure).toBe(false);
    });

    it('should fail if string exceeds max length', () => {
      const result = Guard.againstTooLong('abcdef', 5, 'param');
      expect(result.isFailure).toBe(true);
      expect(result.error.message).toContain('longer than 5 characters');
    });
  });

  // --- 6. isOneOf ---
  describe('isOneOf', () => {
    it('should return OK if value is in the valid list', () => {
      const result = Guard.isOneOf('a', ['a', 'b', 'c'], 'param');
      expect(result.isFailure).toBe(false);
    });

    it('should fail if value is not in the valid list', () => {
      const result = Guard.isOneOf('z', ['a', 'b', 'c'], 'param');
      expect(result.isFailure).toBe(true);
      expect(result.error.message).toContain('isn\'t one Of the correct types');
    });
  });

  // --- 7. isTrue (NEW) ---
  describe('isTrue', () => {
    it('should return OK if value is true', () => {
      const result = Guard.isTrue(true, 'param');
      expect(result.isFailure).toBe(false);
    });

    it('should fail if value is false', () => {
      const result = Guard.isTrue(false, 'param');
      expect(result.isFailure).toBe(true);
      expect(result.error.message).toContain('is not true');
    });
  });

  // --- 8. inRange ---
  describe('inRange', () => {
    it('should return OK if number is inside range', () => {
      const result = Guard.inRange(5, 1, 10, 'param');
      expect(result.isFailure).toBe(false);
    });

    it('should return OK for min edge', () => {
      const result = Guard.inRange(1, 1, 10, 'param');
      expect(result.isFailure).toBe(false);
    });

    it('should return OK for max edge', () => {
      const result = Guard.inRange(10, 1, 10, 'param');
      expect(result.isFailure).toBe(false);
    });

    it('should fail if number is below min', () => {
      const result = Guard.inRange(0, 1, 10, 'param');
      expect(result.isFailure).toBe(true);
      expect(result.error.message).toContain('not within range');
    });

    it('should fail if number is above max', () => {
      const result = Guard.inRange(11, 1, 10, 'param');
      expect(result.isFailure).toBe(true);
    });
  });

  // --- 9. allInRange ---
  describe('allInRange', () => {
    it('should return OK if all numbers are in range', () => {
      const result = Guard.allInRange([1, 5, 10], 1, 10, 'param');
      expect(result.isFailure).toBe(false);
    });

    it('should fail if one number is out of range', () => {
      const result = Guard.allInRange([1, 11, 5], 1, 10, 'param');
      expect(result.isFailure).toBe(true);
      expect(result.error.message).toContain('is not within the range');
    });
  });

  // --- 10. againstNegativeOrZero (NEW) ---
  describe('againstNegativeOrZero', () => {
    it('should return OK for positive numbers', () => {
      const result = Guard.againstNegativeOrZero(1, 'param');
      expect(result.isFailure).toBe(false);
    });

    it('should fail for zero', () => {
      const result = Guard.againstNegativeOrZero(0, 'param');
      expect(result.isFailure).toBe(true);
      expect(result.error.message).toContain('is negative or zero');
    });

    it('should fail for negative numbers', () => {
      const result = Guard.againstNegativeOrZero(-5, 'param');
      expect(result.isFailure).toBe(true);
    });
  });

});