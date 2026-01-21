import z from 'zod';
import { Result } from 'src/index.js';

// TODO add path improvements?  Result API can be cleaned up a bit with better Error handling.
export function unwrapOrIssue<T>(result: Result<T>, ctx: z.RefinementCtx): T | typeof z.NEVER {
  if (result.isFailure) {
    result.getErrorsArray().map((e, i) => {
      ctx.addIssue({
        code: 'custom',
        message: e.message,
        continue: i < result.getErrorsArray().length,
      });
    });
    return z.NEVER;
  }
  return result.value;
}
// TODO let's make the domain part of this more rich than a plain error
export function mapZodError(zodError: z.ZodError): Error[] {
  return zodError.issues.map((issue) => {
    // Format: "week: Number must be greater than 1"
    const path = issue.path.join('.');
    const msg = path ? `${ path }: ${ issue.message }` : issue.message;
    return new Error(msg);
  })
}