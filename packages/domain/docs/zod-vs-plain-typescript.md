# Architectural Decision: Zod Removal Strategy

## Current State Analysis

### Validation Layers

```
┌─────────────────────────────────────────────────────────────┐
│ REQUEST VALIDATION (Keep Zod)                               │
├─────────────────────────────────────────────────────────────┤
│ Gateway: GetCurrentPlanRequestSchema.parse(userInput)       │
│ Purpose: Validate untrusted external input                  │
│ Status: ✅ Necessary - guards against malicious data        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ DOMAIN VALIDATION (Guard class)                             │
├─────────────────────────────────────────────────────────────┤
│ Factories: Guard.againstNullOrUndefined(), Guard.inRange()  │
│ Purpose: Enforce domain invariants at creation time         │
│ Status: ✅ Core domain protection                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ RESPONSE SCHEMAS (Remove Zod)                               │
├─────────────────────────────────────────────────────────────┤
│ Current: FitnessPlanSchema (z.object)                       │
│ Usage: Type inference only (z.infer<>)                      │
│ Validation: ❌ NEVER validated                              │
│ Status: 💡 Dead weight - replace with interfaces            │
└─────────────────────────────────────────────────────────────┘
```

---

## Answers to Your Questions

### 1. Should UseCase Responses Drop Zod?

**YES** - Use plain TypeScript interfaces

**Reasoning**:
- Response schemas are **never validated** (we confirmed this)
- Only used for type inference via `z.infer<>`
- DB data is trusted (validated at domain creation via Guards)
- Mappers transform trusted domain → API format (no validation needed)

**Migration**:
```diff
-export const GetCurrentPlanResponseSchema = z.discriminatedUnion('hasPlan', [...]);
-export type GetCurrentPlanResponse = z.infer<typeof GetCurrentPlanResponseSchema>;

+export type GetCurrentPlanResponse =
+  | { hasPlan: false; message?: string }
+  | { hasPlan: true; plan: FitnessPlanPresentation };
```

---

### 2. Can We Trim Code from `fitness-plan.presentation-plain.ts`?

**YES** -  Remove the manual validator

The `validateFitnessPlanPresentation()` function (lines 136-166) is **unnecessary** because:

1. **Domain Guards** already validated data at creation
2. **Mapper is pure** - transforms trusted data, doesn't need validation
3. **No external input** - data comes from our own database

**Simplified version**:
```typescript
// fitness-plan.presentation.ts (Plain TS version)

export type PlanType = 'event_training' | 'habit_building' | 'strength_program' | 'general_fitness';
export type PlanStatus = 'draft' | 'active' | 'paused' | 'completed' | 'abandoned';

export interface FitnessPlanPresentation {
  id: string;
  userId: string;
  title: string;
  description: string;
  planType: PlanType;
  // ... rest of properties
  currentWorkout?: WorkoutTemplatePresentation;
  currentWeek?: WeeklySchedulePresentation;
  summary: { total: number; completed: number };
}

// Mapper (no validation needed - data already validated by Guards)
export function toFitnessPlanPresentation(plan: FitnessPlan): FitnessPlanPresentation {
  const currentWorkout = Queries.getCurrentWorkout(plan);
  const currentWeek = Queries.getCurrentWeek(plan);
  const summary = Queries.getWorkoutSummary(plan);

  return {
    id: plan.id,
    userId: plan.userId,
    title: plan.title,
    // ... rest is straightforward mapping
    currentWorkout: currentWorkout ? toWorkoutTemplatePresentation(currentWorkout) : undefined,
    currentWeek: currentWeek ? toWeeklySchedulePresentation(currentWeek) : undefined,
    summary,
  };
}
```

**What we lose**: The 50+ lines of manual validation code  
**Impact**: Zero - we weren't using it anyway

---

### 3. Missing Opportunities for Sanity Checks?

**Development-Time Checks Only**

The **only** place where output validation makes sense:

#### Tests (Keep)
```typescript
// fitness-plan.presentation.spec.ts
it('should map to valid presentation schema', () => {
  const plan = createFitnessPlanFixture();
  const presentation = toFitnessPlanPresentation(plan);
  
  // Sanity check in tests
  expect(presentation.id).toBeDefined();
  expect(presentation.summary.completed).toBeGreaterThanOrEqual(0);
  expect(presentation.summary.completed).toBeLessThanOrEqual(presentation.summary.total);
});
```

#### Development Mode Assertions (Optional)
```typescript
export function toFitnessPlanPresentation(plan: FitnessPlan): FitnessPlanPresentation {
  const result = { /* ... mapping ... */ };
  
  if (process.env.NODE_ENV === 'development') {
    // Sanity checks in dev only
    console.assert(result.summary.completed <= result.summary.total, 
      'Completed workouts should not exceed total');
  }
  
  return result;
}
```

**Production**: No runtime validation needed (trust Guards + tests)

---

### 4. Entity Types as Zod + Derive Client Schema?

**NO** - Keep current separation

#### Option A: Zod Entity Types (Don't Do)
```typescript
// ❌ Entity as Zod
const FitnessPlanSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  startDate: z.date(),
  // ...
});

type FitnessPlan = z.infer<typeof FitnessPlanSchema>;

// Derive presentation
const FitnessPlanPresentationSchema = FitnessPlanSchema.extend({
  startDate: z.string().datetime(), // Override to ISO string
  currentWorkout: WorkoutTemplateSchema.optional(),
  summary: z.object({ total: z.number(), completed: z.number() }),
});
```

**Problems**:
1. **Domain contamination**: Core entities depend on Zod
2. **Factory complexity**: `create()` must return Zod-validated data
3. **Circular dependencies**: Presentation → Entity → Presentation
4. **Date type mismatch**: Entity uses `Date`, API uses `string` (hard to override)
5. **Guards redundant**: Why have both `Guard.againstEmptyString()` AND `z.string().min(1)`?

#### Option B: Current Separation (Keep)
```typescript
// ✅ Entity as Plain TS
interface FitnessPlanData {
  id: string;
  title: string;
  startDate: Date;
  // ...
}

export type FitnessPlan = Readonly<FitnessPlanData>;

// ✅ Presentation as Plain TS
export interface FitnessPlanPresentation {
  id: string;
  title: string;
  startDate: string; // ISO string
  currentWorkout?: WorkoutTemplatePresentation;
  summary: { total: number; completed: number };
}
```

**Advantages**:
1. **Pure domain**: No external dependencies
2. **Clear separation**: Domain types !== API types
3. **Guards handle validation**: Single validation strategy
4. **Type safety**: TypeScript ensures correct mapping

---

### 5. About Presentation Schemas in Domain

You're right to question this! Let's examine the two options:

#### Option A: Presentation in Domain (Current) ✅

```
packages/domain/training/core/
└── fitness-plan/
    ├── fitness-plan.types.ts          (Entity)
    ├── fitness-plan.presentation.ts   (View Model)
    └── fitness-plan.queries.ts        (Enrichment)
```

**Pros**:
- ✅ **Cohesion**: Entity + its view model + enrichment logic together
- ✅ **Better testing**: Local fixtures + mappers in same package
- ✅ **Exhaustive mapping**: Queries are co-located, easy to use
- ✅ **Single responsibility**: Domain defines its API contract

**Cons**:
- ❌ Presentation is technically a "concern" of the application layer
- ❌ Breaks pure DDD (presentation isn't domain)

#### Option B: Presentation in Application Layer

```
packages/domain/training/application/
└── mappers/
    └── fitness-plan.mapper.ts  (toFitnessPlanPresentation)

packages/domain/training/core/
└── fitness-plan/
    ├── fitness-plan.types.ts
    └── fitness-plan.queries.ts
```

**Pros**:
- ✅ "Pure" DDD (domain has no API concerns)

**Cons**:
- ❌ **Fragmentation**: Mapper separated from entity
- ❌ **Testing complexity**: Need to import fixtures from core
- ❌ **Query leakage**: Application must import domain queries
- ❌ **Ownership confusion**: Who defines the API contract?

**Verdict**: **Keep presentation in domain** (Option A)

**Rationale**: The benefits (cohesion, testing, exhaustive mapping) outweigh the DDD purism. Think of it as the domain defining its "view contract."

---

## Recommended Architecture

### Final Structure

```typescript
// Domain Layer (training-core)
// ==============================

// fitness-plan.types.ts (Plain TS)
export interface FitnessPlanData {
  id: string;
  title: string;
  startDate: Date;
  // ...
}
export type FitnessPlan = Readonly<FitnessPlanData>;

// fitness-plan.factory.ts (Guard validation)
export function create(params: CreateFitnessPlanParams): Result<FitnessPlan> {
  const guards = [
    Guard.againstEmptyString(params.title, 'title'),
    Guard.againstTooLong(params.title, 100, 'title'),
    // ...
  ];
  // ...
}

// fitness-plan.presentation.ts (Plain TS interface)
export interface FitnessPlanPresentation {
  id: string;
  title: string;
  startDate: string; // ISO
  // ...
  currentWorkout?: WorkoutTemplatePresentation;
  summary: { total: number; completed: number };
}

export function toFitnessPlanPresentation(plan: FitnessPlan): FitnessPlanPresentation {
  // Pure mapper, no validation
  return { /* ... */ };
}

// Application Layer (training-application)
// ========================================

// get-current-plan.ts (Plain TS types)
export interface GetCurrentPlanRequest {
  userId: string;
}

export type GetCurrentPlanResponse =
  | { hasPlan: false; message?: string }
  | { hasPlan: true; plan: FitnessPlanPresentation };

export class GetCurrentPlanUseCase {
  async execute(request: GetCurrentPlanRequest): Promise<Result<GetCurrentPlanResponse>> {
    const plan = await this.repo.findActive(request.userId);
    
    if (!plan) {
      return Result.ok({ hasPlan: false });
    }
    
    return Result.ok({
      hasPlan: true,
      plan: toFitnessPlanPresentation(plan),
    });
  }
}

// Gateway Layer
// =============

// routes/fitness-plan.ts (Zod for REQUEST validation only)
import { z } from 'zod';

export const GetCurrentPlanRequestSchema = z.object({
  userId: z.string().uuid(),
});

app.get('/active', async (c) => {
  const user = c.get('user');
  
  // ✅ Validate REQUEST
  const validated = GetCurrentPlanRequestSchema.parse({ userId: user.id });
  
  const result = await stub.getCurrentPlan(validated);
  
  // ✅ No validation - just return typed result
  return handleResult<GetCurrentPlanResponse>(result, c);
});
```

---

## Migration Checklist

### Step 1: Convert Response Schemas
- [ ] Replace `FitnessPlanSchema` with `FitnessPlanPresentation` interface
- [ ] Replace `WeeklyScheduleSchema` with `WeeklySchedulePresentation` interface
- [ ] Replace `WorkoutTemplateSchema` with `WorkoutTemplatePresentation` interface
- [ ] Replace all use-case response `z.object()` with plain types/interfaces

### Step 2: Update Mappers
- [ ] Rename `toFitnessPlanSchema` → `toFitnessPlanPresentation`
- [ ] Remove any `.parse()` calls in mappers
- [ ] Keep pure transformation logic

### Step 3: Keep Request Validation
- [ ] Keep `GetCurrentPlanRequestSchema` (Zod)
- [ ] Keep all `*RequestSchema` in gateway routes
- [ ] Keep `zValidator()` middleware

### Step 4: Update Tests
- [ ] Replace `FitnessPlanSchema.parse()` with type assertions
- [ ] Use simple property checks instead of schema validation
```

typescript
// Before
const parsed = FitnessPlanSchema.parse(presentation);

// After
expect(presentation.id).toBeDefined();
expect(presentation.summary.completed).toBeGreaterThanOrEqual(0);
```

### Step 5: Remove Zod Dependency
- [ ] Remove Zod from `@bene/training-core` dependencies
- [ ] Remove Zod from `@bene/training-application` dependencies
- [ ] Keep Zod in `@bene/gateway` (for request validation)

---

## Summary

| Layer | Type System | Validation | Keep/Remove |
|-------|-------------|------------|-------------|
| **Domain Entity** | Plain TS interface | Guards (factory) | ✅ Keep |
| **Domain Presentation** | Plain TS interface | None (trusted data) | ✅ Keep, remove Zod |
| **Application Request** | Zod schema | `.parse()` at gateway | ✅ Keep Zod |
| **Application Response** | Plain TS type/interface | None | ✅ Keep, remove Zod  |

**Net effect**: 
- Remove ~500+ lines of Zod response schemas
- Keep ~100 lines of Zod request schemas
- Maintain same runtime behavior (we weren't validating responses anyway)
- Cleaner, simpler codebase
