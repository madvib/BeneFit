// Example Base Class (Optional)

import { Result } from '../../index.js';

export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<Result<TOutput>>;
}

export abstract class BaseUseCase<TInput, TOutput> implements UseCase<TInput, TOutput> {
  // Enforces that concrete classes must implement this method
  protected abstract performExecution(input: TInput): Promise<Result<TOutput>>;

  // Logging configuration
  private static readonly isDevelopment = process.env.NODE_ENV !== 'production';
  private static readonly isVerbose = process.env.VERBOSE_LOGGING === 'true';

  public async execute(input: TInput): Promise<Result<TOutput>> {
    const startTime = Date.now();
    const useCaseName = this.constructor.name;

    // Start Logging (development only)
    if (BaseUseCase.isDevelopment) {
      this.logStart(useCaseName, input);
    }

    try {
      // Perform Execution
      const result = await this.performExecution(input);

      // End Logging (development only)
      if (BaseUseCase.isDevelopment) {
        const duration = Date.now() - startTime;
        this.logEnd(useCaseName, result, duration);
      }

      return result;
    } catch (error) {
      // Error Logging (always log errors, even in production)
      const duration = Date.now() - startTime;
      this.logError(useCaseName, error, duration);

      return Result.fail(
        new Error(
          `System error in ${ useCaseName }: ${ error instanceof Error ? error.message : 'Unknown error' }`,
        ),
      );
    }
  }

  // Pretty logging methods
  private logStart(useCaseName: string, input: TInput): void {
    console.log(`\n🚀 ${ useCaseName }`);

    if (BaseUseCase.isVerbose) {
      console.log('📥 Input:', JSON.stringify(this.sanitizeInput(input), null, 2));
    }

    console.log(`⏱️  Started at ${ new Date().toISOString() }`);
  }

  private logEnd(useCaseName: string, result: Result<TOutput>, duration: number): void {
    const icon = result.isSuccess ? '✅' : '⚠️';
    const status = result.isSuccess ? 'SUCCESS' : 'FAILURE';

    console.log(`${ icon } ${ useCaseName } - ${ status } (${ duration }ms)`);

    if (BaseUseCase.isVerbose && result.isFailure) {
      console.log('❌ Error:', result.error);
    }
  }

  private logError(useCaseName: string, error: unknown, duration: number): void {
    console.error(`\n💥 ${ useCaseName } - ERROR (${ duration }ms)`);
    console.error('❌ Message:', error instanceof Error ? error.message : 'Unknown error');

    if (BaseUseCase.isDevelopment && error instanceof Error && error.stack) {
      console.error('📚 Stack trace:\n', error.stack);
    }
  }

  // Helper to prevent logging sensitive data like passwords
  // Child classes can override this if needed
  protected sanitizeInput(input: TInput): unknown {
    return input;
  }

  // You could define an abstract validate method here for consistency
  // protected abstract validate(input: TInput): Result<void>;
}
