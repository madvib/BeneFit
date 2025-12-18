import type { AppType } from './index.js';
import { hc } from 'hono/client';

// this is a trick to calculate the type when compiling
export type Client = ReturnType<typeof hc<AppType>>;

export const createClient = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);
