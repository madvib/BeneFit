import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '../../..');
const OUTPUT_DIR = join(ROOT_DIR, 'packages/react-api-client/src/generated/fixtures');

// Import fixture builders (these use domain fixtures + presentation mappers)
import { buildGetCurrentPlanResponse } from './fixture-builders/get-current-plan.builder.js';

// Import schemas for other use cases (still using zod-schema-faker for now)
import {
  GetCoachHistoryResponseSchema,
  SendMessageToCoachResponseSchema,
  GenerateWeeklySummaryResponseSchema,
  RespondToCheckInResponseSchema,
  DismissCheckInResponseSchema,
  TriggerProactiveCheckInResponseSchema,
} from '@bene/coach-domain';

import {
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

function serializeValue(value: any, indent = 0): string {
  const spaces = '  '.repeat(indent);
  const nextSpaces = '  '.repeat(indent + 1);

  if (value instanceof Date) {
    return `new Date("${ value.toISOString() }")`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.length === 1) return `[${ serializeValue(value[0], indent) }]`;

    const items = value.map(v => `${ nextSpaces }${ serializeValue(v, indent + 1) }`);
    return `[\n${ items.join(',\n') }\n${ spaces }]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';

    const props = entries.map(
      ([k, v]) => `${ nextSpaces }${ k }: ${ serializeValue(v, indent + 1) }`
    );
    return `{\n${ props.join(',\n') }\n${ spaces }}`;
  }

  return JSON.stringify(value);
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function generateFixtureFile(fixtureName: string, fixtureData: any): string {
  const typeName = fixtureName.charAt(0).toUpperCase() + fixtureName.slice(1);
  const singularName = fixtureName.replace(/Response$/, '');
  const arrayTypeName = singularName.charAt(0).toUpperCase() + singularName.slice(1);

  return `// Auto-generated fixture - DO NOT EDIT
// Generated: ${ new Date().toISOString() }
// Source: apps/gateway/scripts/generate-domain-fixtures.ts

/**
 * Fixture for ${ fixtureName }
 */
export const ${ fixtureName } = ${ serializeValue(fixtureData) } as const;

/**
 * Create ${ typeName } with custom overrides
 */
export function create${ typeName }(
  overrides?: Partial<typeof ${ fixtureName }>
) {
  return { ...${ fixtureName }, ...overrides };
}

/**
 * Generate array of ${ arrayTypeName } fixtures
 */
export function create${ arrayTypeName }Array(
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
  console.log('🎨 Generating fixtures from domain...');

  // domainMap can contain either:
  // - Zod schemas (will be faked using zod-schema-faker)
  // - Pre-built fixture objects (from domain fixture builders)
  const domainMap: Record<string, Record<string, any>> = {
    coach: {
      getCoachHistoryResponse: GetCoachHistoryResponseSchema,
      sendMessageResponse: SendMessageToCoachResponseSchema,
      generateWeeklySummaryResponse: GenerateWeeklySummaryResponseSchema,
      respondToCheckInResponse: RespondToCheckInResponseSchema,
      dismissCheckInResponse: DismissCheckInResponseSchema,
      triggerProactiveCheckInResponse: TriggerProactiveCheckInResponseSchema,
    },
    'fitness-plans': {
      // ✅ Uses domain fixture pattern!
      getCurrentPlanResponse: buildGetCurrentPlanResponse('with-plan'),
      // ❌ Still using zod-schema-faker (TODO: migrate these)
      generatePlanFromGoalsResponse: GeneratePlanFromGoalsResponseSchema,
      activatePlanResponse: ActivatePlanResponseSchema,
    },
    workouts: {
      getUpcomingWorkoutsResponse: GetUpcomingWorkoutsResponseSchema,
      getWorkoutHistoryResponse: GetWorkoutHistoryResponseSchema,
      getTodaysWorkoutResponse: GetTodaysWorkoutResponseSchema,
    },
    profile: {
      getProfileResponse: GetProfileResponseSchema,
      getUserStatsResponse: GetUserStatsResponseSchema,
    },
    integrations: {
      getConnectedServicesResponse: GetConnectedServicesResponseSchema,
      syncServiceDataResponse: SyncServiceDataResponseSchema,
    }
  };

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const indexExports: string[] = [];

  // Generate fixtures organized by domain
  Object.entries(domainMap).forEach(([domain, schemas]) => {
    const domainDir = join(OUTPUT_DIR, domain);
    mkdirSync(domainDir, { recursive: true });

    const domainExports: string[] = [];

    Object.entries(schemas).forEach(([key, schemaOrData]) => {
      // If it's already a fixture object (from a builder), use it directly
      // Otherwise, fake it from the zod schema
      const data = typeof schemaOrData === 'object' && '_def' in schemaOrData
        ? fake(schemaOrData) // It's a Zod schema
        : schemaOrData;      // It's pre-built fixture data

      const fileName = toKebabCase(key.replace(/Response$/, ''));
      const filePath = join(domainDir, `${ fileName }.ts`);

      // Generate individual fixture file
      const fixtureCode = generateFixtureFile(key, data);
      writeFileSync(filePath, fixtureCode);

      console.log(`  ✓ Generated ${ domain }/${ fileName }.ts`);

      // Track exports for domain index
      domainExports.push(`export * from './${ fileName }.js';`);
    });

    // Generate domain index.ts
    const domainIndexPath = join(domainDir, 'index.ts');
    const domainIndexContent = `// Auto-generated domain index - DO NOT EDIT
// Generated: ${ new Date().toISOString() }

${ domainExports.join('\n') }
`;
    writeFileSync(domainIndexPath, domainIndexContent);
    console.log(`  ✓ Generated ${ domain }/index.ts`);

    // Track exports for main index
    indexExports.push(`export * as ${ domain.replace(/-/g, '') } from './${ domain }/index.js';`);
  });

  // Generate main index.ts
  const mainIndexPath = join(OUTPUT_DIR, 'index.ts');
  const mainIndexContent = `// Auto-generated fixtures index - DO NOT EDIT
// Generated: ${ new Date().toISOString() }
// Pattern: Domain Fixtures → Presentation Mappers → API Responses

/**
 * Organized fixture exports by domain
 * 
 * Usage:
 * \`\`\`ts
 * import { fitnessplans, workouts } from '@bene/react-api-client/fixtures';
 * 
 * const plan = fitnessplans.getCurrentPlanResponse;
 * const history = workouts.getWorkoutHistoryResponse;
 * \`\`\`
 */

${ indexExports.join('\n') }

// Re-export individual fixtures for convenience
${ Object.keys(domainMap).map(domain => `export * from './${ domain }/index.js';`).join('\n') }
`;
  writeFileSync(mainIndexPath, mainIndexContent);
  console.log(`  ✓ Generated fixtures/index.ts`);

  console.log(`\n✅ Fixtures generated to ${ OUTPUT_DIR }`);
}

run().catch(err => {
  console.error('❌ Fixture generation failed:', err);
  process.exit(1);
});
