/**
 * HTTP Response Builders for MSW Handlers and Testing
 * 
 * These functions take domain fixtures and unwrap them into HTTP-ready response data.
 * 
 * **Use them in:**
 * - MSW handlers (test/msw/) - Mock HTTP responses in tests and Storybook
 * - Direct testing - When you need API-shaped response data
 * - Any scenario requiring API response shapes
 * 
 * **Features:**
 * - Unwraps domain Result<T> automatically
 * - Seed control for reproducible data
 * - Raw builders available for Result<T> fuzzing
 * 
 * @example
 * ```typescript
 * // In MSW handler
 * http.get('/api/coach/history', () => {
 *   return HttpResponse.json(buildGetCoachHistoryResponse());
 * });
 * 
 * // With seed for reproducibility
 * const data = buildGetCoachHistoryResponse(undefined, { seed: 42 });
 * 
 * // Fuzzing with raw builder
 * const result = buildTriggerProactiveCheckInResponseRaw({}, { temperature: 0.3 });
 * ```
 */

export * from './coach.js';
export * from './training.js';
export * from './integrations.js';

// Namespace export for cleaner imports
import * as coach from './coach.js';
import * as training from './training.js';
import * as integrations from './integrations.js';
import * as explore from './explore.js';

export const fixtures = {
  coach,
  training,
  integrations,
  explore,
};

export * from './explore.js';

