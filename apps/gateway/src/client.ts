import type { AppType } from './index.js';
import { hc } from 'hono/client';

export type Client = ReturnType<typeof hc<AppType>>;

export const createClient = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);