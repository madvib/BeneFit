# Test Organization & File Structure - Recommendations

## Current State Analysis

### Current Test Files
```
test/
├── fitness-plan.spec.ts         (~70 lines) - Factory/creation tests
├── fitness-plan.view.spec.ts    (~100 lines) - View mapper tests
├── fitness-plan.presentation.spec.ts (skipped) - Old Zod tests
└── fitness-plan.fixtures.ts     - Test data
```

### Current Source Files
```
fitness-plan.factory.ts          - Creation logic (Guards + Result)
fitness-plan.view.ts             - Single mapper function (~40 lines)
fitness-plan.queries.ts          - Query logic
fitness-plan.commands.ts         - Command logic
fitness-plan.types.ts            - Types + View interface
```

---

## Problem 1: Test File Fragmentation

### Current Issues
- ❌ **Unclear boundaries**: When to put a test in `.spec.ts` vs `.view.spec.ts`?
- ❌ **Duplication risk**: Both files import fixtures, similar setup
- ❌ **Missing coverage visibility**: No clear "this entity is fully tested" signal
- ❌ **Fragmented context**: Have to jump between files to understand entity

### What Needs Coverage
1. **Factory** (creation logic)
   - Valid creation
   - Guard validations
   - Edge cases

2. **View Mapper** (conversion logic)
   - Field mapping correctness
   - Date serialization
   - Computed fields
   - Omitted fields

3. **Queries** (read operations)
   - getCurrentWorkout()
   - getCurrentWeek()
   - getWorkoutSummary()

4. **Commands** (mutations)
   - activate()
   - pause()
   - skipWorkout()

---

## Recommendation 1: Single Comprehensive Test File

### Proposed Structure

```typescript
// test/fitness-plan.spec.ts (single file, ~200-250 lines)

describe('FitnessPlan', () => {
  // ============================================
  // FACTORY (Creation & Validation)
  // ============================================
  describe('Factory', () => {
    describe('createDraftFitnessPlan', () => {
      it('should create valid plan', () => { /* ... */ });
      it('should fail if title is empty', () => { /* ... */ });
      it('should fail if title too long', () => { /* ... */ });
      it('should default status to draft', () => { /* ... */ });
    });
    
    describe('workoutPlanFromPersistence', () => {
      it('should reconstitute from DB', () => { /* ... */ });
      it('should maintain readonly arrays', () => { /* ... */ });
    });
  });

  // ============================================
  // VIEW MAPPER (API Conversion)
  // ============================================
  describe('View Mapper', () => {
    describe('toFitnessPlanView', () => {
      it('should map all fields correctly', () => { /* ... */ });
      it('should serialize dates as ISO strings', () => { /* ... */ });
      it('should omit internal fields', () => { /* ... */ });
      it('should include computed summary', () => { /* ... */ });
      it('should include current workout', () => { /* ... */ });
      it('should handle missing current workout', () => { /* ... */ });
    });
  });

  // ============================================
  // QUERIES (Read Operations)
  // ============================================
  describe('Queries', () => {
    describe('getCurrentWorkout', () => {
      it('should return workout for current position', () => { /* ... */ });
      it('should return undefined if no workout scheduled', () => { /* ... */ });
    });
    
    describe('getCurrentWeek', () => {
      it('should return current week', () => { /* ... */ });
    });
    
    describe('getWorkoutSummary', () => {
      it('should calculate total and completed', () => { /* ... */ });
      it('should handle empty weeks', () => { /* ... */ });
    });
  });

  // ============================================
  // COMMANDS (Mutations)
  // ============================================
  describe('Commands', () => {
    describe('activate', () => {
      it('should change status to active', () => { /* ... */ });
      it('should fail if already active', () => { /* ... */ });
    });
    
    describe('pause', () => {
      it('should change status to paused', () => { /* ... */ });
      it('should record pause reason', () => { /* ... */ });
    });
  });
});
```

### Benefits
✅ **Single source** - All entity tests in one place  
✅ **Clear sections** - Organized by responsibility  
✅ **Easy to spot gaps** - Missing sections = missing coverage  
✅ **Better context** - See whole entity behavior at once  
✅ **Simpler maintenance** - One file to update  

### When to Split
Only split if file exceeds ~500 lines AND has natural boundary:
- `fitness-plan.spec.ts` - Core entity tests (factory, queries, commands)
- `fitness-plan-integration.spec.ts` - Cross-aggregate tests
- `fitness-plan-performance.spec.ts` - Performance/stress tests

---

## Problem 2: Misleading File Name

### Current Issue
```
fitness-plan.view.ts              ← Misleading name
  - Contains: 1 mapper function
  - Suggests: View component or view layer
```

**Confusion**: "view" implies UI component, not data transformation

---

## Recommendation 2A: Move to Factory (Preferred)

### Rationale
- **Factory's job**: Create entities AND convert them
  - Create: `createDraftFitnessPlan()` - domain → entity
  - Convert: `toFitnessPlanView()` - entity → API

- **Co-location**: Creation and conversion are related
- **Simplicity**: One less file to manage
- **DDD alignment**: Factories handle object construction/deconstruction

### Proposed Structure

```typescript
// fitness-plan.factory.ts (~120 lines)

import type { FitnessPlan, FitnessPlanView } from './fitness-plan.types.js';
import * as Queries from './fitness-plan.queries.js';

// ============================================
// CREATION (Domain → Entity)
// ============================================

export function createDraftFitnessPlan(
  params: CreateFitnessPlanParams
): Result<FitnessPlan> {
  // Guard validations
  const guards = [
    Guard.againstEmptyString(params.title, 'title'),
    Guard.againstTooLong(params.title, 100, 'title'),
  ];
  
  // Return entity
  return Result.ok(/* ... */);
}

export function workoutPlanFromPersistence(
  data: FitnessPlanData
): Result<FitnessPlan> {
  // Reconstitute from DB
  return Result.ok(data as FitnessPlan);
}

// ============================================
// CONVERSION (Entity → API View)
// ============================================

export function toFitnessPlanView(plan: FitnessPlan): FitnessPlanView {
  const currentWorkout = Queries.getCurrentWorkout(plan);
  const currentWeek = Queries.getCurrentWeek(plan);
  const summary = Queries.getWorkoutSummary(plan);

  return {
    // Entity fields
    id: plan.id,
    userId: plan.userId,
    title: plan.title,
    // ...
    
    // Date serialization
    startDate: plan.startDate.toISOString(),
    createdAt: plan.createdAt.toISOString(),
    
    // Computed fields
    currentWorkout,
    currentWeek,
    summary,
  };
}
```

### File Structure After
```
fitness-plan/
├── fitness-plan.types.ts        ← Entity + View interface
├── fitness-plan.factory.ts      ← Creation + Conversion
├── fitness-plan.queries.ts      ← Read operations
├── fitness-plan.commands.ts     ← Mutations
└── test/
    ├── fitness-plan.spec.ts     ← ALL tests
    └── fitness-plan.fixtures.ts
```

**Total files**: 5 (down from 6)

---

## Recommendation 2B: Rename to Mapper (Alternative)

If you want to keep it separate:

```typescript
// fitness-plan.mapper.ts (~40 lines)

/**
 * Map FitnessPlan entity to API view model
 */
export function toFitnessPlanView(plan: FitnessPlan): FitnessPlanView {
  // ... mapping logic
}
```

### When to Use Separate Mapper
- Mapper has **complex logic** (>100 lines)
- Mapper used in **multiple contexts** (not just factory)
- Team preference for **strict file-per-concern**

---

## Recommendation 2C: Types File (Not Recommended)

Could add to `types.ts`, but:
- ❌ Mixes data definitions with logic
- ❌ Types file becomes catch-all
- ❌ Harder to tree-shake

---

## Final Recommendations

### 1. Test Organization: **Single File**

```
test/fitness-plan.spec.ts       - ALL entity tests
  ├── Factory
  ├── View Mapper
  ├── Queries
  └── Commands
```

**Migration**:
1. Copy view tests into `fitness-plan.spec.ts` under "View Mapper" section
2. Delete `fitness-plan.view.spec.ts`
3. Delete/skip `fitness-plan.presentation.spec.ts`

### 2. View Mapper Location: **Move to Factory**

```
fitness-plan.factory.ts         - Creation + Conversion
```

**Migration**:
1. Move `toFitnessPlanView()` to bottom of `fitness-plan.factory.ts`
2. Update imports (should be internal)
3. Delete `fitness-plan.view.ts`
4. Update exports in `index.ts`

---

## Comparison Table

| Aspect | Current | Recommended |
|--------|---------|-------------|
| **Test files** | 2-3 separate | 1 comprehensive |
| **Test organization** | By file | By responsibility |
| **Coverage visibility** | Fragmented | Clear sections |
| **Mapper location** | Separate `.view.ts` | In `.factory.ts` |
| **Total entity files** | 6-7 | 5 |
| **Clarity** | "What is view?" | "Factory creates & converts" |

---

## Migration Script

### Step 1: Merge Test Files

```bash
# 1. Create new comprehensive test file
cp test/fitness-plan.spec.ts test/fitness-plan.spec.ts.backup

# 2. Manually merge view tests into factory tests with sections

# 3. Delete old files
rm test/fitness-plan.view.spec.ts
rm test/fitness-plan.presentation.spec.ts
```

### Step 2: Move Mapper to Factory

```bash
# Will be manual - copy toFitnessPlanView() to factory.ts
# Update imports
# Delete fitness-plan.view.ts
# Update index.ts exports
```

---

## Validation

After migration, verify:

```bash
# 1. Tests still pass
pnpm nx test @bene/training-core --testPathPattern=fitness-plan.spec

# 2. Builds succeed
pnpm nx run @bene/training-core:build

# 3. No broken imports
grep -r "fitness-plan.view" packages/
```

---

## Example: Complete Single Test File

```typescript
import { describe, it, expect } from 'vitest';
import {
  createDraftFitnessPlan,
  workoutPlanFromPersistence,
  toFitnessPlanView,
} from '../fitness-plan.factory.js';
import { createFitnessPlanFixture } from './fitness-plan.fixtures.js';
import * as Queries from '../fitness-plan.queries.js';
import * as Commands from '../fitness-plan.commands.js';

describe('FitnessPlan', () => {
  // ============================================
  // FACTORY
  // ============================================
  describe('Factory', () => {
    describe('createDraftFitnessPlan', () => {
      it('should create valid plan', () => {
        const result = createDraftFitnessPlan({
          userId: 'user-123',
          title: 'My Plan',
          description: 'Test',
          // ...
        });
        
        expect(result.isSuccess).toBe(true);
        expect(result.value.status).toBe('draft');
      });

      it('should fail if title empty', () => {
        const result = createDraftFitnessPlan({
          userId: 'user-123',
          title: '',
          // ...
        });
        
        expect(result.isFailure).toBe(true);
        expect(result.error).toContain('title');
      });
    });

    describe('workoutPlanFromPersistence', () => {
      it('should reconstitute from DB', () => {
        const data = { /* DB data */ };
        const result = workoutPlanFromPersistence(data);
        
        expect(result.isSuccess).toBe(true);
      });
    });
  });

  // ============================================
  // VIEW MAPPER
  // ============================================
  describe('View Mapper', () => {
    describe('toFitnessPlanView', () => {
      it('should map all fields', () => {
        const plan = createFitnessPlanFixture();
        const view = toFitnessPlanView(plan);
        
        expect(view.id).toBe(plan.id);
        expect(view.title).toBe(plan.title);
      });

      it('should serialize dates as ISO', () => {
        const plan = createFitnessPlanFixture();
        const view = toFitnessPlanView(plan);
        
        expect(typeof view.startDate).toBe('string');
        expect(typeof view.createdAt).toBe('string');
      });

      it('should omit internal fields', () => {
        const plan = createFitnessPlanFixture({ templateId: 'internal' });
        const view = toFitnessPlanView(plan);
        
        expect('templateId' in view).toBe(false);
      });

      it('should include computed summary', () => {
        const plan = createFitnessPlanFixture();
        const view = toFitnessPlanView(plan);
        
        expect(view.summary).toBeDefined();
        expect(view.summary.total).toBeGreaterThan(0);
      });
    });
  });

  // ============================================
  // QUERIES
  // ============================================
  describe('Queries', () => {
    describe('getCurrentWorkout', () => {
      it('should return current workout', () => {
        const plan = createFitnessPlanFixture({
          currentPosition: { week: 1, day: 1 }
        });
        
        const workout = Queries.getCurrentWorkout(plan);
        expect(workout).toBeDefined();
        expect(workout?.dayOfWeek).toBe(1);
      });

      it('should return undefined if no workout', () => {
        const plan = createFitnessPlanFixture({
          currentPosition: { week: 1, day: 2 }
        });
        
        const workout = Queries.getCurrentWorkout(plan);
        expect(workout).toBeUndefined();
      });
    });

    describe('getWorkoutSummary', () => {
      it('should calculate total and completed', () => {
        const plan = createFitnessPlanFixture();
        const summary = Queries.getWorkoutSummary(plan);
        
        expect(summary.total).toBeGreaterThan(0);
        expect(summary.completed).toBeGreaterThanOrEqual(0);
      });
    });
  });

  // ============================================
  // COMMANDS
  // ============================================
  describe('Commands', () => {
    describe('activate', () => {
      it('should activate draft plan', () => {
        const plan = createFitnessPlanFixture({ status: 'draft' });
        const result = Commands.activate(plan);
        
        expect(result.isSuccess).toBe(true);
        expect(result.value.status).toBe('active');
      });
    });

    describe('pause', () => {
      it('should pause active plan', () => {
        const plan = createFitnessPlanFixture({ status: 'active' });
        const result = Commands.pause(plan, 'User requested');
        
        expect(result.isSuccess).toBe(true);
        expect(result.value.status).toBe('paused');
      });
    });
  });
});
```

---

## Summary

### ✅ Do This
1. **Merge test files** into single `fitness-plan.spec.ts` with clear sections
2. **Move view mapper** to `fitness-plan.factory.ts` (creation + conversion)
3. **Delete** `fitness-plan.view.ts` and `fitness-plan.view.spec.ts`

### ✅ Benefits
- Clearer organization (sections by responsibility)
- Better discoverability (all entity tests in one place)
- Simpler file structure (5 files instead of 7)
- Accurate naming (factory handles conversion)
- Easier to spot coverage gaps

### ✅ Update Handover Guide
Add this pattern to migration checklist:
- Single `*.spec.ts` with sections
- View mapper in `*.factory.ts`
