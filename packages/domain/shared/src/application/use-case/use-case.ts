// Example Base Class (Optional)

import { Result } from "@core/index.js";

export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<Result<TOutput>>;
}

export abstract class BaseUseCase<TInput, TOutput> implements UseCase<TInput, TOutput> {
  // Enforces that concrete classes must implement this method
  protected abstract performExecution(input: TInput): Promise<Result<TOutput>>;

  public async execute(input: TInput): Promise<Result<TOutput>> {
    // 1. Common Pre-Execution Logic (e.g., Logging, Auth Check)
    console.log(`[USE_CASE] Executing ${this.constructor.name}`);

    // 2. Perform Validation (If needed, using the Guard class)
    // const validationResult = this.validate(input);
    // if (validationResult.isFailure) return validationResult;

    // 3. Delegate to the concrete implementation
    try {
      return await this.performExecution(input);
    } catch (error) {
      // Catch unexpected system errors (e.g., database connection failure)
      return Result.fail(
        new Error(
          `System error in ${this.constructor.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ),
      );
    }
  }

  // You could define an abstract validate method here for consistency
  // protected abstract validate(input: TInput): Result<void>;
}
