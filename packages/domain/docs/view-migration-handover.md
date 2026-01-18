# View Pattern Migration - Handover Guide

> **Status**: FitnessPlan ✅ Complete | Remaining: ~8-12 aggregates
> 
> **Goal**: Migrate all domain aggregates from Zod presentation schemas to plain TypeScript view interfaces

---

## Table of Contents

1. [Overview](#overview)
2. [Pattern Summary](#pattern-summary)
3. [Migration Checklist (Per Aggregate)](#migration-checklist-per-aggregate)
4. [Detailed Steps](#detailed-steps)
5. [Special Cases & Gotchas](#special-cases--gotchas)
6. [Validation & Testing](#validation--testing)
7. [Remaining Work](#remaining-work)

---

## Overview

### What We're Doing

Converting from **Zod-based presentation schemas** (verbose, unnecessary) to **plain TypeScript view interfaces** (DRY, maintainable).

### Why

- ✅ **50% less code** (~150 lines → ~70 lines per entity)
- ✅ **DRY**: View extends entity via `Omit<>`
- ✅ **No drift**: Changes to entity auto-reflected in view
- ✅ **Smaller bundle**: No Zod schemas for responses
- ✅ **Same behavior**: We never validated responses anyway

### Pattern

```typescript
// 1. Co-locate view interface in *.types.ts (~20 lines)
export interface EntityView extends Omit<Entity, 'dateField' | 'internalField'> {
  dateField: string;  // ISO serialization
  computed: ComputedType;  // Enrichment
}

// 2. Co-locate mapper in *.factory.ts (with creation logic)
export function toEntityView(entity: Entity): EntityView {
  return { /* pure mapping */ };
}

// 3. Plain TS use case response
export type GetEntityResponse = { entity: EntityView };
```

---

## Migration Checklist (Per Aggregate)

Use this checklist for each aggregate migration:

### Phase 1: Entity View Interface
- [ ] 1.1: Identify entity and its presentation schema
- [ ] 1.2: Add `EntityView` interface to `*.types.ts`
- [ ] 1.3: Determine what to `Omit<>` (see [Special Cases](#special-cases--gotchas))
- [ ] 1.4: Add enriched/computed fields to view

### Phase 2: View Mapper (Factory)
- [ ] 2.1: Add `toEntityView()` mapper function to `*.factory.ts`
- [ ] 2.2: Handle Date serialization (`.toISOString()`)
- [ ] 2.3: Map nested entities (use their view mappers)
- [ ] 2.4: Add enriched fields from queries

### Phase 3: Tests (Single Spec File)
- [ ] 3.1: Add "View Mapper" section to `*.spec.ts`
- [ ] 3.2: Add property assertion tests (no Zod)
- [ ] 3.3: Add date serialization tests
- [ ] 3.4: Delete/Skip old `*.presentation.spec.ts` and `*.view.spec.ts`

### Phase 4: Use Cases
- [ ] 4.1: Find all use cases returning this entity
- [ ] 4.2: Replace Zod response schema with plain TS type
- [ ] 4.3: Update mapper call (`toEntitySchema` → `toEntityView`)
- [ ] 4.4: Keep request schema as Zod (validate input)

### Phase 5: Fixtures & Stories
- [ ] 5.1: Create/update fixture builder in `apps/gateway/scripts/fixture-builders/`
- [ ] 5.2: Use `toEntityView()` in builder
- [ ] 5.3: Update story to use new fixture import path
- [ ] 5.4: Regenerate fixtures (`pnpm nx run @bene/gateway:build-client`)

### Phase 6: Cleanup & Exports
- [ ] 6.1: Update `index.ts` exports (export mapper from factory)
- [ ] 6.2: Delete `*.presentation.ts` and `*.view.ts`
- [ ] 6.3: Verify no imports of old presentation schema
- [ ] 6.4: Run builds & tests

### Phase 7: Validation
- [ ] 7.1: All tests pass (`pnpm nx test @bene/domain-name`)
- [ ] 7.2: Builds succeed (core + application)
- [ ] 7.3: Fixtures generate successfully
- [ ] 7.4: Story renders correctly
- [ ] 7.5: No TypeScript errors

---

## Detailed Steps

### Step 1: Identify Entity & Presentation Schema

**Where to look**:
```
packages/domain/{domain}/core/src/
  └── {aggregate}/
      └── entities/{entity}/
          ├── {entity}.types.ts           ← Entity definition
          ├── {entity}.factory.ts         ← Creation logic (add mapper here)
          ├── {entity}.presentation.ts    ← Current Zod schema (to replace)
          └── test/
              ├── {entity}.spec.ts        ← Main tests (add view tests here)
              └── {entity}.presentation.spec.ts
```

**Example**: `FitnessPlan`
- Entity: `packages/domain/training/core/src/fitness-plan/aggregates/fitness-plan/entities/fitness-plan/fitness-plan.types.ts`
- Presentation: `fitness-plan.presentation.ts` (has `FitnessPlanSchema`)

---

### Step 2: Add View Interface to `*.types.ts`

**Template**:
```typescript
// ============================================
// View Interface (API Presentation)
// ============================================

/**
 * {EntityName} view for API consumption
 * 
 * Differences from entity:
 * - Dates serialized as ISO strings
 * - Enriched with computed fields (...)
 * - Omits internal/sensitive fields (...)
 */
export interface {EntityName}View extends Omit<
  {EntityName},
  'dateField1' | 'dateField2' | 'internalField'
> {
  // Date fields as ISO strings
  dateField1: string;
  dateField2?: string;
  
  // Computed/enriched fields
  computedField?: ComputedType;
  enrichedData: EnrichedType;
}
```

**What to Omit** (see [Special Cases](#date-serialization--what-to-omit)):
1. **Date fields** (entity has `Date`, view uses `string`)
2. **Internal fields** (e.g., `templateId`, `_version`)
3. **Sensitive fields** (e.g., `passwordHash`, `secretKey`)

**What to Add**:
1. **Computed fields** (from queries/calculations)
2. **Enriched data** (cross-aggregate lookups)
3. **Summary data** (aggregations, counts)

**Example** (FitnessPlan):
```typescript
export interface FitnessPlanView extends Omit<
  FitnessPlan,
  'startDate' | 'endDate' | 'createdAt' | 'updatedAt' | 'templateId'
> {
  // Date overrides
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt?: string;
  
  // Enriched
  currentWorkout?: WorkoutTemplateView;
  currentWeek?: WeeklyScheduleView;
  summary: { total: number; completed: number };
}
```

---

### Step 3: Add View Mapper to `*.factory.ts`

**Template**:
```typescript
// ... existing factory imports ...
import type { {EntityName}View } from './{entity}.types.js';
import { toNestedEntityView } from '../nested-entity/{nested-entity}.factory.js'; // or view.js stub
import * as Queries from './{entity}.queries.js';

// ... existing creation functions ...

// ============================================
// CONVERSION (Entity → API View)
// ============================================

/**
 * Map {EntityName} entity to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 * - Enriches with computed fields
 * - Omits internal fields
 */
export function to{EntityName}View(entity: {EntityName}): {EntityName}View {
  // Compute enriched fields
  const enrichedData = Queries.getEnrichedData(entity);
  
  return {
    // Entity fields (TypeScript ensures completeness via Omit)
    id: entity.id,
    field1: entity.field1,
    field2: entity.field2,
    // ... all non-omitted fields
    
    // Nested entities (use their view mappers)
    nestedEntities: entity.nestedEntities.map(toNestedEntityView),
    
    // Date serialization
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt?.toISOString(),
    
    // Enriched fields
    enrichedData,
  };
}
```

**Key Points**:
- **Co-location**: Conversion logic lives with creation logic
- **No validation**: Pure transformation (domain Guards already validated)
- **Nested entities**: Use their view mappers (may need stubs initially)
- **Dates**: Always `.toISOString()` for JSON serialization

---

### Step 4: Create Stub View Mappers (For Nested Entities)

If nested entities don't have view mappers yet, create stubs (can be temporary `*.view.ts` or in their factory):

```typescript
// {nested-entity}.view.ts (or factory)
import type { NestedEntity } from './{nested-entity}.types.js';

// TODO: Add NestedEntityView interface to types.ts
export type NestedEntityView = NestedEntity;

export function toNestedEntityView(entity: NestedEntity): NestedEntityView {
  // TODO: Implement proper view mapping
  return entity as NestedEntityView;
}
```

---

### Step 5: Update Tests (`*.spec.ts`)

Add a new section to the existing `test/{entity}.spec.ts`:

**Template**:
```typescript
import { to{EntityName}View } from '../{entity}.factory.js';

describe('{EntityName} Aggregate', () => {
  // ... existing Factory tests ...

  // ============================================
  // VIEW MAPPER (API Conversion)
  // ============================================
  describe('View Mapper', () => {
    it('should map entity to view model', () => {
      const entity = create{EntityName}Fixture();
      const view = to{EntityName}View(entity);

      // Basic fields
      expect(view.id).toBe(entity.id);
      expect(view.field1).toBe(entity.field1);
    });

    it('should serialize dates as ISO strings', () => {
      const entity = create{EntityName}Fixture();
      const view = to{EntityName}View(entity);

      expect(typeof view.createdAt).toBe('string');
      expect(() => new Date(view.createdAt)).not.toThrow();
    });

    it('should include computed fields', () => {
      const entity = create{EntityName}Fixture();
      const view = to{EntityName}View(entity);

      expect(view.computedField).toBeDefined();
    });

    it('should omit internal fields', () => {
      const entity = create{EntityName}Fixture({ internalField: 'secret' });
      const view = to{EntityName}View(entity);

      expect('internalField' in view).toBe(false);
    });
  });
});
```

**Skip old test**:
```typescript
// {entity}.presentation.spec.ts
describe.skip('Old Zod Presentation', () => {
  // ... old tests (keep for reference, delete later)
});
```

---

### Step 6: Update Use Cases

**Before**:
```typescript
import { z } from 'zod';
import { EntitySchema, toEntitySchema } from '@bene/domain-core';

export const GetEntityResponseSchema = z.object({
  entity: EntitySchema,
});

export type GetEntityResponse = z.infer<typeof GetEntityResponseSchema>;

// In use case
return Result.ok({ entity: toEntitySchema(entity) });
```

**After**:
```typescript
import { z } from 'zod';
import type { EntityView } from '@bene/domain-core';
import { toEntityView } from '@bene/domain-core';

// Request: Keep Zod (validate input)
export const GetEntityRequestSchema = z.object({
  userId: z.string().uuid(),
});

export type GetEntityRequest = z.infer<typeof GetEntityRequestSchema>;

// Response: Plain TS (no Zod)
export type GetEntityResponse = {
  entity: EntityView;
};

// In use case
return Result.ok({ entity: toEntityView(entity) });
```

**Find all use cases**:
```bash
# Search for use cases returning this entity
grep -r "toEntitySchema" packages/domain/{domain}/application/src/use-cases/
```

---

### Step 7: Update Fixture Builders

**Create/update builder**:
```typescript
// apps/gateway/scripts/fixture-builders/{use-case}.builder.ts
import { create{EntityName}Fixture, to{EntityName}View } from '@bene/{domain}-core';
import type { {UseCase}Response } from '@bene/{domain}-application';

export function build{UseCase}Response(): {UseCase}Response {
  // 1. Create domain fixture
  const entity = create{EntityName}Fixture();

  // 2. Apply view mapper
  const entityView = to{EntityName}View(entity);

  // 3. Build response
  return {
    entity: entityView,
  };
}
```

**Update generation script**:
```typescript
// apps/gateway/scripts/generate-domain-fixtures.ts

import { build{UseCase}Response } from './fixture-builders/{use-case}.builder.js';

const domainMap = {
  '{DomainName}': {
    {useCaseName}Response: build{UseCase}Response(), // ✅ Domain-based
  },
};
```

---

### Step 8: Update Stories

**Update story import**:
```typescript
// Before
import { fixtures } from '@bene/react-api-client';
const mockData = fixtures.create{UseCase}Response(undefined, { seed: 42 });

// After
import * as fixtures from '@bene/react-api-client/fixtures';
const mockData = fixtures.{domainname}.{useCaseName}Response;
```

---

### Step 9: Update Exports

**Entity index.ts**:
```typescript
// Before
export type { Entity } from './{entity}.types.js';
export * from './{entity}.presentation.js';  // ❌ Remove

// After
export type { Entity, EntityView } from './{entity}.types.js';  // ✅ Add View
export * from './{entity}.view.js';  // ✅ Add mapper
```

**Application index.ts**:
```typescript
// Before
export { GetEntityRequestSchema, GetEntityResponseSchema } from './use-cases/...';

// After
export { GetEntityRequestSchema } from './use-cases/...';  // ✅ Keep request
// GetEntityResponseSchema removed (no longer exists)
```

---

### Step 10: Cleanup

**Files to modify**:
- [ ] Comment out `*.presentation.ts` (or delete after verification)
- [ ] Skip `*.presentation.spec.ts` (`describe.skip`)
- [ ] Remove Zod response schema exports from application `index.ts`

**Verify no imports**:
```bash
# Search for old imports
grep -r "toEntitySchema" packages/
grep -r "EntitySchema" packages/ | grep -v "RequestSchema"
grep -r "{Entity}ResponseSchema" packages/
```

---

## Special Cases & Gotchas

### Date Serialization & What to Omit

**Rule**: If entity has `Date`, view has `string`

**Always Omit**:
```typescript
// Common date fields
'createdAt' | 'updatedAt' | 'deletedAt' | 'publishedAt' | 'scheduledAt'
'startDate' | 'endDate' | 'dueDate' | 'completedAt'
'birthdate' | 'eventDate' | 'expiresAt'
```

**Pattern**:
```typescript
export interface EntityView extends Omit<Entity, 'createdAt' | 'startDate'> {
  createdAt: string;  // Date → ISO string
  startDate: string;
}

// In mapper
return {
  // ...
  createdAt: entity.createdAt.toISOString(),
  startDate: entity.startDate.toISOString(),
};
```

### Nested Dates

For nested value objects with dates:

```typescript
// Value object type
interface EventData {
  scheduledAt: Date;
}

// Entity
interface Entity {
  event: EventData;
}

// View
interface EntityView extends Omit<Entity, 'event'> {
  event: {
    scheduledAt: string;  // Override nested date
  };
}

// Mapper
return {
  // ...
  event: {
    ...entity.event,
    scheduledAt: entity.event.scheduledAt.toISOString(),
  },
};
```

### Optional Dates

```typescript
export interface EntityView extends Omit<Entity, 'endDate'> {
  endDate?: string;  // Optional Date → optional string
}

// Mapper
return {
  // ...
  endDate: entity.endDate?.toISOString(),  // Use ?.
};
```

### Arrays of Dates

```typescript
interface Entity {
  milestones: Date[];
}

interface EntityView extends Omit<Entity, 'milestones'> {
  milestones: string[];
}

// Mapper
return {
  // ...
  milestones: entity.milestones.map(d => d.toISOString()),
};
```

### Internal Fields to Omit

**Common patterns**:
```typescript
// Version tracking
'_version' | '__v' | 'version'

// Internal IDs
'templateId' | 'internalId' | 'legacyId'

// System fields
'_metadata' | 'systemData' | 'debugInfo'

// Sensitive data
'passwordHash' | 'secretKey' | 'apiToken'
```

### Readonly Arrays

Entity arrays are often readonly. View can be mutable:

```typescript
// Entity
interface Entity {
  items: readonly Item[];
}

// View
interface EntityView extends Omit<Entity, 'items'> {
  items: ItemView[];  // Mutable array
}

// Mapper
return {
  // ...
  items: entity.items.map(toItemView),  // Maps readonly → mutable
};
```

### Discriminated Unions

Keep discriminated unions in views:

```typescript
// Entity
type EntityStatus = 
  | { state: 'pending' }
  | { state: 'active'; startedAt: Date }
  | { state: 'completed'; completedAt: Date };

// View
type EntityStatusView =
  | { state: 'pending' }
  | { state: 'active'; startedAt: string }
  | { state: 'completed'; completedAt: string };

export interface EntityView extends Omit<Entity, 'status'> {
  status: EntityStatusView;
}

// Mapper
function toStatusView(status: EntityStatus): EntityStatusView {
  switch (status.state) {
    case 'pending':
      return { state: 'pending' };
    case 'active':
      return { state: 'active', startedAt: status.startedAt.toISOString() };
    case 'completed':
      return { state: 'completed', completedAt: status.completedAt.toISOString() };
  }
}

return {
  // ...
  status: toStatusView(entity.status),
};
```

---

## Validation & Testing

### Per-Aggregate Validation

After completing each aggregate:

```bash
# 1. Run entity tests
pnpm nx test @bene/{domain}-core --testPathPattern={entity}.view.spec

# 2. Build domain packages
pnpm nx run @bene/{domain}-core:build
pnpm nx run @bene/{domain}-application:build

# 3. Regenerate fixtures
pnpm nx run @bene/gateway:build-client

# 4. Build client
pnpm nx run @bene/react-api-client:build

# 5. Check stories (if applicable)
pnpm nx run @bene/web:storybook
```

### Red Flags

**TypeScript errors**:
- "Property X does not exist on type EntityView"
  → Missing field in view interface
- "Type Y is not assignable to type Z"
  → Date/type mismatch in Omit

**Test failures**:
- "Expected string, received object"
  → Forgot to serialize Date
- "Expected X to be defined"
  → Missing computed field

**Build failures**:
- "Cannot find module"
  → Missing export in index.ts
- "Circular dependency"
  → Import cycle (use type-only imports)

### Smoke Tests

```typescript
// Quick sanity check
it('view should be JSON-serializable', () => {
  const entity = createEntityFixture();
  const view = toEntityView(entity);
  
  // Should not throw
  const json = JSON.stringify(view);
  const parsed = JSON.parse(json);
  
  expect(parsed.id).toBe(view.id);
});
```

---

## Remaining Work

### Training Domain

**Core Aggregates** (`@bene/training-core`):
- [x] FitnessPlan ✅ **COMPLETE**
- [ ] WeeklySchedule (stub exists, needs implementation)
- [ ] WorkoutTemplate (stub exists, needs implementation)
- [ ] CompletedWorkout
- [ ] ActiveWorkout (if exists)

**Use Cases** (`@bene/training-application`):
- [x] get-current-plan ✅
- [ ] generate-plan-from-goals
- [ ] activate-plan
- [ ] get-upcoming-workouts
- [ ] get-workout-history
- [ ] get-todays-workout
- [ ] get-user-stats
- [ ] skip-workout
- [ ] start-workout
- [ ] complete-workout

### Coach Domain

**Core Aggregates** (`@bene/coach-domain`):
- [ ] CheckIn
- [ ] CoachMessage
- [ ] WeeklySummary

**Use Cases**:
- [ ] get-coach-history
- [ ] send-message
- [ ] generate-weekly-summary
- [ ] respond-to-check-in
- [ ] dismiss-check-in

### Integrations Domain

**Core Aggregates** (`@bene/integrations-domain`):
- [ ] ServiceConnection
- [ ] SyncStatus

**Use Cases**:
- [ ] get-connected-services
- [ ] sync-service-data

### Profile Domain

**Core Aggregates** (if separate):
- [ ] UserProfile
- [ ] UserStats
- [ ] FitnessGoals

**Use Cases**:
- [ ] get-profile
- [ ] update-profile

---

## Workflow Per Session

### Session Structure

```
1. Pick ONE aggregate
2. Follow checklist (Phases 1-7)
3. Validate (run tests + builds)
4. Create handover notes
5. Commit with clear message
```

### Suggested Order

**Priority 1** (High-value, commonly used):
1. CompletedWorkout
2. WorkoutTemplate  
3. WeeklySchedule (complete the stubs)
4. UserProfile

**Priority 2** (Medium-value):
5. ActiveWorkout
6. CheckIn
7. CoachMessage
8. ServiceConnection

**Priority 3** (Lower priority):
9. WeeklySummary
10. SyncStatus

### Time Estimates

Per aggregate:
- Simple entity (no nesting): **20-30 min**
- Complex entity (nested, computed): **45-60 min**
- With use cases + fixtures + stories: **+30 min**

Total remaining work: **~10-15 hours** (across multiple sessions)

---

## Handover Format

When ending a session, create a handover note:

```markdown
## Session Handover: {EntityName} Migration

**Status**: ✅ Complete / 🔄 In Progress / ⚠️ Blocked

**Completed**:
- [x] Phase 1: Added EntityView to types.ts
- [x] Phase 2: Created view mapper
- [x] Phase 3: Tests passing
- [ ] Phase 4: Use cases (2/5 updated)
- [ ] Phase 5: Fixtures (not started)

**Issues/Blockers**:
- Nested entity XYZ doesn't have view mapper (created stub)
- Test failing for date serialization (needs investigation)

**Next Steps**:
1. Complete remaining use cases (list them)
2. Create fixture builder
3. Update relevant stories

**Files Modified**:
- packages/domain/{domain}/core/src/{aggregate}/entities/{entity}/{entity}.types.ts
- packages/domain/{domain}/core/src/{aggregate}/entities/{entity}/{entity}.view.ts
- (list all)

**Run to verify**:
```bash
pnpm nx test @bene/{domain}-core --testPathPattern={entity}
pnpm nx run @bene/{domain}-core:build
```
```

---

## Quick Reference

### Commands

```bash
# Test single entity
pnpm nx test @bene/{domain}-core --testPathPattern={entity}.view.spec

# Build domain packages
pnpm nx run @bene/{domain}-core:build
pnpm nx run @bene/{domain}-application:build

# Regenerate fixtures
pnpm nx run @bene/gateway:build-client

# Build client
pnpm nx run @bene/react-api-client:build

# Run all tests
pnpm nx test @bene/{domain}-core
```

### File Patterns

```
Entity/View: {entity}.types.ts
Factory:     {entity}.factory.ts (contains mapper)
Test:        test/{entity}.spec.ts (contains all tests)
Fixture:     test/{entity}.fixtures.ts
```

---

## Success Criteria

Migration is complete when:

✅ All aggregates have `EntityView` interface  
✅ All aggregates have `toEntityView()` mapper  
✅ All view tests pass  
✅ All use cases use plain TS responses  
✅ All fixture builders use view mappers  
✅ All stories use new fixture imports  
✅ All old `.presentation.ts` files deleted  
✅ No Zod response schemas remain  
✅ Full build pipeline succeeds  

---

## Resources

- **Pattern Guide**: `packages/domain/docs/view-model-pattern.md`
- **Zod Decision**: `packages/domain/docs/zod-vs-plain-typescript.md`
- **Example**: `FitnessPlan` (completed reference implementation)

---

**Ready to start? Pick an aggregate and follow the checklist!** 🚀
