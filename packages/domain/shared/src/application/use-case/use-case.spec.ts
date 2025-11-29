import { describe, it, expect } from 'vitest';
import { UseCase } from './use-case.js';
import { Result } from '../../core/base-classes/result/result.js';

// Create a test implementation to verify the interface
interface TestInput {
  value: number;
}

interface TestOutput {
  result: number;
}

class TestUseCase implements UseCase<TestInput, TestOutput> {
  async execute(input: TestInput): Promise<Result<TestOutput>> {
    if (input.value < 0) {
      return Result.fail(new Error('Value must be positive'));
    }
    return Result.ok({ result: input.value * 2 });
  }
}

describe('UseCase interface', () => {
  it('should be implemented by concrete use cases', async () => {
    const useCase = new TestUseCase();

    // Test successful execution
    const input: TestInput = { value: 5 };
    const result = await useCase.execute(input);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.result).toBe(10); // 5 * 2
    }
  });

  it('should handle errors through Result pattern', async () => {
    const useCase = new TestUseCase();

    // Test error execution
    const input: TestInput = { value: -1 };
    const result = await useCase.execute(input);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('Value must be positive');
    }
  });

  it('should follow the UseCase interface signature', () => {
    const useCase: UseCase<TestInput, TestOutput> = {
      execute: async (input: TestInput) => {
        return Result.ok({ result: input.value });
      },
    };

    expect(useCase).toBeDefined();
    expect(typeof useCase.execute).toBe('function');
  });
});
