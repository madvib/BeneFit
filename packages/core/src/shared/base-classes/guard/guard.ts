import { Result } from '../result/result.js';

export interface IGuardArgument {
  argument: unknown;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static combine(guardResults: Result<unknown>[]): Result<unknown, Error[]> {
    const errors: Error[] = [];
    for (const result of guardResults) {
      // IMPORTANT, this assumes no other methods throw multiple errors
      if (result.isFailure) errors.push(result.error as Error);
    }
    if (errors.length > 0) {
      return Result.fail(errors);
    }
    return Result.ok();
  }

  public static againstNullOrUndefined(
    argument: unknown,
    argumentName: string,
  ): Result<unknown> {
    if (argument === null || argument === undefined) {
      return Result.fail(new Error(`${argumentName} is null or undefined`));
    } else {
      return Result.ok();
    }
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection,
  ): Result<unknown> {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
      if (result.isFailure) return result;
    }

    return Result.ok();
  }

  public static againstEmptyString(
    argument: unknown,
    argumentName: string,
  ): Result<unknown> {
    if (argument === '') {
      return Result.fail(new Error(`${argumentName} is empty`));
    } else {
      return Result.ok();
    }
  }

  public static isOneOf(
    value: unknown,
    validValues: unknown[],
    argumentName: string,
  ): Result<unknown> {
    let isValid = false;
    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return Result.ok();
    } else {
      return Result.fail(
        new Error(
          `${argumentName} isn't one Of the correct types in ${JSON.stringify(
            validValues,
          )}. Got "${value}".`,
        ),
      );
    }
  }

  public static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string,
  ): Result<unknown> {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return Result.fail(
        new Error(`${argumentName} is not within range ${min} to ${max}.`),
      );
    } else {
      return Result.ok();
    }
  }

  public static allInRange(
    numbers: number[],
    min: number,
    max: number,
    argumentName: string,
  ): Result<unknown> {
    let failingResult: Result<unknown> | null = null;
    for (const num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (!numIsInRangeResult.isFailure) continue;
      failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return Result.fail(new Error(`${argumentName} is not within the range.`));
    } else {
      return Result.ok();
    }
  }
  public static againstTooLong(
    argument: string,
    maxLength: number,
    argumentName: string,
  ): Result<unknown> {
    if (argument.length > maxLength) {
      return Result.fail(
        new Error(`${argumentName} is longer than ${maxLength} characters.`),
      );
    } else {
      return Result.ok();
    }
  }

  public static isTrue(argument: boolean, argumentName: string): Result<unknown> {
    if (!argument) {
      return Result.fail(new Error(`${argumentName} is not true.`));
    } else {
      return Result.ok();
    }
  }
  public static againstNegative(
    argument: number,
    argumentName: string,
  ): Result<unknown> {
    if (argument < 0) {
      return Result.fail(new Error(`${argumentName} is negative.`));
    } else {
      return Result.ok();
    }
  }
  public static againstNegativeOrZero(
    argument: number,
    argumentName: string,
  ): Result<unknown> {
    if (argument <= 0) {
      return Result.fail(new Error(`${argumentName} is negative or zero.`));
    } else {
      return Result.ok();
    }
  }
}
