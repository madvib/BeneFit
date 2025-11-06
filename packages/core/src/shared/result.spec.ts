import { describe, it, expect } from 'vitest';
import { Result } from './result';

describe('Result', () => {
  describe('ok', () => {
    it('should create a successful result with value', () => {
      const value = 'test';
      const result = Result.ok(value);
      
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.value).toBe(value);
    });

    it('should create a successful result without value', () => {
      const result = Result.ok();
      
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.value).toBe(undefined);
    });
  });

  describe('fail', () => {
    it('should create a failed result with error', () => {
      const error = new Error('test error');
      const result = Result.fail(error);
      
      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe(error);
    });
  });

  describe('value getter', () => {
    it('should return the value when result is successful', () => {
      const value = 'test';
      const result = Result.ok(value);
      
      expect(result.value).toBe(value);
    });

    it('should throw error when accessing value on failed result', () => {
      const error = new Error('test error');
      const result = Result.fail(error);
      
      expect(() => result.value).toThrow('Cannot get value from failed result');
    });
  });

  describe('error getter', () => {
    it('should return the error when result is failed', () => {
      const error = new Error('test error');
      const result = Result.fail(error);
      
      expect(result.error).toBe(error);
    });

    it('should throw error when accessing error on successful result', () => {
      const result = Result.ok('test');
      
      expect(() => result.error).toThrow('Cannot get error from successful result');
    });
  });

  describe('map', () => {
    it('should transform value when result is successful', () => {
      const result = Result.ok(5);
      const mappedResult = result.map(x => x * 2);
      
      expect(mappedResult.isSuccess).toBe(true);
      expect(mappedResult.value).toBe(10);
    });

    it('should not transform when result is failed', () => {
      const error = new Error('test error');
      const result = Result.fail(error);
      const mappedResult = result.map((x: number) => x * 2);
      
      expect(mappedResult.isFailure).toBe(true);
      expect(mappedResult.error).toBe(error);
    });
  });

  describe('mapError', () => {
    it('should transform error when result is failed', () => {
      const originalError = new Error('original error');
      const result = Result.fail(originalError);
      const mappedResult = result.mapError(err => new Error(`mapped: ${err.message}`));
      
      expect(mappedResult.isFailure).toBe(true);
      expect(mappedResult.error.message).toBe('mapped: original error');
    });

    it('should not transform when result is successful', () => {
      const result = Result.ok('test');
      const mappedResult = result.mapError((err: Error) => new Error(`mapped: ${err.message}`));
      
      expect(mappedResult.isSuccess).toBe(true);
      expect(mappedResult.value).toBe('test');
    });
  });

  describe('asyncMap', () => {
    it('should transform value asynchronously when result is successful', async () => {
      const result = Result.ok(5);
      const mappedResult = await result.asyncMap(async x => x * 2);
      
      expect(mappedResult.isSuccess).toBe(true);
      expect(mappedResult.value).toBe(10);
    });

    it('should not transform when result is failed', async () => {
      const error = new Error('test error');
      const result = Result.fail(error);
      const mappedResult = await result.asyncMap(async (x: number) => x * 2);
      
      expect(mappedResult.isFailure).toBe(true);
      expect(mappedResult.error).toBe(error);
    });
  });
});