import type { InferResponseType } from 'hono/client';

export type ApiSuccessResponse<T> = Exclude<
  InferResponseType<T, 200>,
  string | { error: string }
>;
