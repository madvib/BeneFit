import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '../../..');
const OUTPUT_DIR = join(ROOT_DIR, 'packages/react-api-client/src/generated');

// Import schemas
import {
  GetCoachHistoryResponseSchema,
  SendMessageToCoachResponseSchema,
  GenerateWeeklySummaryResponseSchema,
  RespondToCheckInResponseSchema,
  DismissCheckInResponseSchema,
  TriggerProactiveCheckInResponseSchema,
} from '@bene/coach-domain';

import {
  GetCurrentPlanResponseSchema,
  GeneratePlanFromGoalsResponseSchema,
  ActivatePlanResponseSchema,
  GetUpcomingWorkoutsResponseSchema,
  GetWorkoutHistoryResponseSchema,
  GetTodaysWorkoutResponseSchema,
  GetProfileResponseSchema,
  GetUserStatsResponseSchema,
} from '@bene/training-application';

import {
  GetConnectedServicesResponseSchema,
  SyncServiceDataResponseSchema,
} from '@bene/integrations-domain';

import { fake } from '../__fixtures__/setup.js';

function serializeValue(value: any): string {
  if (value instanceof Date) {
    return `new Date("${ value.toISOString() }")`;
  }
  if (Array.isArray(value)) {
    return `[${ value.map(serializeValue).join(', ') }]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).map(
      ([k, v]) => `${ k }: ${ serializeValue(v) }`
    );
    return `{ ${ entries.join(', ') } }`;
  }
  return JSON.stringify(value);
}

function generateFixtureCode(fixtureName: string, fixtureData: any, description: string): string {
  return `
/**
 * ${ description }
 */
export const ${ fixtureName } = ${ serializeValue(fixtureData) } as const;
`;
}

function generateHelperCode(fixtureName: string): string {
  const typeName = fixtureName.charAt(0).toUpperCase() + fixtureName.slice(1);
  return `
/**
 * Create ${ typeName } with custom overrides
 */
export function create${ typeName }(
  overrides?: Partial<typeof ${ fixtureName }>
) {
  return { ...${ fixtureName }, ...overrides };
}
`;
}

function generateArrayHelperCode(fixtureName: string): string {
  const singularName = fixtureName.replace(/Response$/, '');
  const typeName = singularName.charAt(0).toUpperCase() + singularName.slice(1);

  return `
/**
 * Generate array of ${ typeName } fixtures
 */
export function create${ typeName }Array(
  count: number,
  overrides?: (index: number) => Partial<typeof ${ fixtureName }>
) {
  return Array.from({ length: count }, (_, i) => ({
    ...${ fixtureName },
    ...(overrides?.(i) ?? {})
  }));
}
`;
}

async function run() {
  console.log('🎨 Generating fixtures...');

  let fixturesCode = `// Auto-generated fixtures - DO NOT EDIT
// Generated: ${ new Date().toISOString() }
// Source: apps/gateway/scripts/generate-fixtures.ts

`;

  const domainMap = {
    Coach: {
      getCoachHistoryResponse: GetCoachHistoryResponseSchema,
      sendMessageResponse: SendMessageToCoachResponseSchema,
      generateWeeklySummaryResponse: GenerateWeeklySummaryResponseSchema,
      respondToCheckInResponse: RespondToCheckInResponseSchema,
      dismissCheckInResponse: DismissCheckInResponseSchema,
      triggerProactiveCheckInResponse: TriggerProactiveCheckInResponseSchema,
    },
    'Fitness Plans': {
      getCurrentPlanResponse: GetCurrentPlanResponseSchema,
      generatePlanFromGoalsResponse: GeneratePlanFromGoalsResponseSchema,
      activatePlanResponse: ActivatePlanResponseSchema,
    },
    Workouts: {
      getUpcomingWorkoutsResponse: GetUpcomingWorkoutsResponseSchema,
      getWorkoutHistoryResponse: GetWorkoutHistoryResponseSchema,
      getTodaysWorkoutResponse: GetTodaysWorkoutResponseSchema,
    },
    Profile: {
      getProfileResponse: GetProfileResponseSchema,
      getUserStatsResponse: GetUserStatsResponseSchema,
    },
    Integrations: {
      getConnectedServicesResponse: GetConnectedServicesResponseSchema,
      syncServiceDataResponse: SyncServiceDataResponseSchema,
    }
  };

  Object.entries(domainMap).forEach(([domain, schemas]) => {
    fixturesCode += `\n/**
 * ============================================
 * ${ domain.toUpperCase() } FIXTURES
 * ============================================
 */\n`;

    Object.entries(schemas).forEach(([key, schema]) => {
      const data = fake(schema);
      fixturesCode += generateFixtureCode(key, data, `${ domain } - ${ key }`);
      fixturesCode += generateHelperCode(key);
      fixturesCode += generateArrayHelperCode(key);
    });
  });

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Write file
  writeFileSync(join(OUTPUT_DIR, 'fixtures.ts'), fixturesCode);

  console.log(`✅ Fixtures generated to ${ join(OUTPUT_DIR, 'fixtures.ts') }`);
}

run().catch(err => {
  console.error('❌ Fixture generation failed:', err);
  process.exit(1);
});
