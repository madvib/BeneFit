# View Model Pattern

## Overview

Clean, DRY pattern for defining API view models alongside domain entities using TypeScript utilities.

---

## File Structure

```
fitness-plan/
├── fitness-plan.types.ts    ← Entity + View interface (co-located)
├── fitness-plan.view.ts     ← Mapper only (slim)
├── fitness-plan.queries.ts  ← Enrichment logic
└── test/
    └── fitness-plan.fixtures.ts
```

---

## Pattern

### 1. Entity Types (`*.types.ts`)

```typescript
// Entity
export interface FitnessPlanData {
  id: string;
  userId: string;
  title: string;
  startDate: Date;          // Internal: Date object
  createdAt: Date;
  templateId?: string;      // Internal field
  // ...
}

export type FitnessPlan = Readonly<FitnessPlanData>;

// View (derived from entity using TS utilities)
export interface FitnessPlanView extends Omit<FitnessPlan, 'startDate' | 'createdAt' | 'templateId'> {
  // Override: serialize dates
  startDate: string;         // API: ISO string
  createdAt: string;
  
  // Add: enriched fields
  currentWorkout?: WorkoutTemplateView;
  summary: { total: number; completed: number };
}
```

**Benefits**:
- ✅ DRY: No duplication of shared fields
- ✅ Type safety: `Omit` ensures we handle all overrides
- ✅ Co-located: Entity and its view defined together
- ✅ Explicit: Comments document differences

---

### 2. View Mapper (appended to `*.factory.ts`)

```typescript
import type { FitnessPlan, FitnessPlanView } from './fitness-plan.types.js';
import * as Queries from './fitness-plan.queries.js';

export function toFitnessPlanView(plan: FitnessPlan): FitnessPlanView {
  return {
    // Entity fields (TypeScript ensures completeness)
    id: plan.id,
    userId: plan.userId,
    title: plan.title,
    // ... rest of fields
    
    // Date serialization
    startDate: plan.startDate.toISOString(),
    createdAt: plan.createdAt.toISOString(),
    
    // Enrichment
    currentWorkout: Queries.getCurrentWorkout(plan),
    summary: Queries.getWorkoutSummary(plan),
  };
}
```

**Benefits**:
- ✅ Slim: Just mapping logic (~40 lines)
- ✅ Pure: No validation (entity already validated by Guards)
- ✅ Testable: Use local fixtures

---

### 3. Use Case Response (Application Layer)

```typescript
import type { FitnessPlanView } from '@bene/training-core';
import { toFitnessPlanView } from '@bene/training-core';

// Response: Plain TypeScript (no Zod)
export type GetCurrentPlanResponse = {  plan: FitnessPlanView };

export class GetCurrentPlanUseCase {
  async execute(req: GetCurrentPlanRequest): Promise<Result<GetCurrentPlanResponse>> {
    const plan = await this.repo.findActive(req.userId);
    
    if (!plan) {
      return Result.ok({ hasPlan: false });
    }
    
    return Result.ok({
      plan: toFitnessPlanView(plan), // ← Use view mapper
    });
  }
}
```

**Benefits**:
- ✅ No Zod: Response types are plain TS
- ✅ Type-safe: Discriminated union for hasPlan
- ✅ Clean: No schema definitions, just types

---

### 4. Request Validation (Gateway Layer)

```typescript
import { z } from 'zod';

// Request: Keep Zod (validate user input)
export const GetCurrentPlanRequestSchema = z.object({
  userId: z.string().uuid(),
});

app.get('/active', async (c) => {
  // ✅ Validate request
  const validated = GetCurrentPlanRequestSchema.parse({ userId: user.id });
  
  const result = await useCase.execute(validated);
  
  // ✅ No response validation - just return typed result
  return handleResult<GetCurrentPlanResponse>(result, c);
});
```

---

## Common View Patterns

### Pattern 1: Date Serialization

```typescript
// Entity
interface EntityData {
  createdAt: Date;
  updatedAt?: Date;
}

// View
interface EntityView extends Omit<Entity, 'createdAt' | 'updatedAt'> {
  createdAt: string;        // ISO string
  updatedAt?: string;       // ISO string
}
```

### Pattern 2: Omit Internal Fields

```typescript
// Entity
interface EntityData {
  id: string;
  publicData: string;
  internalField: string;    // ← Hide from API
}

// View
interface EntityView extends Omit<Entity, 'internalField'> {
  // internalField not exposed
}
```

### Pattern 3: Add Computed Fields

```typescript
// Entity
interface EntityData {
  items: Item[];
}

// View
interface EntityView extends Entity {
  // Add computed field
  itemCount: number;
  summary: { total: number; active: number };
}
```

### Pattern 4: Nested Views

```typescript
// Entity
interface ParentData {
  children: Child[];
}

// View
interface ParentView extends Omit<Parent, 'children'> {
  children: ChildView[];    // ← Use child's view type
}

// Mapper
export function toParentView(parent: Parent): ParentView {
  return {
    ...parent,
    children: parent.children.map(toChildView),
  };
}
```

---

## Migration Checklist

### For Each Entity:

- [ ] **1. Update `*.types.ts`**
  ```typescript
  // Add view interface using Omit/extends
  export interface EntityView extends Omit<Entity, 'dateField' | 'internalField'> {
    dateField: string;
    computedField: ComputedType;
  }
  ```

- [ ] **2. Rename `*.presentation.ts` → `*.view.ts`**
  - Remove Zod schema
  - Keep mapper function
  - Rename `toEntitySchema` → `toEntityView`

- [ ] **3. Update use case**
  ```diff
  -import { EntitySchema, toEntitySchema } from '@bene/core';
  -export const ResponseSchema = z.object({ entity: EntitySchema });
  -export type Response = z.infer<typeof ResponseSchema>;
  
  +import type { EntityView } from '@bene/core';
  +import { toEntityView } from '@bene/core';
  +export type Response = { entity: EntityView };
  ```

- [ ] **4. Update exports**
  ```typescript
  // index.ts
  export * from './entity.types.js';
  export * from './entity.view.js';
  ```

---

## Example: Complete Entity

### `fitness-plan.types.ts`

```typescript
export type PlanStatus = 'draft' | 'active' | 'paused';

interface FitnessPlanData {
  id: string;
  title: string;
  startDate: Date;
  weeks: WeeklySchedule[];
  status: PlanStatus;
  createdAt: Date;
}

export type FitnessPlan = Readonly<FitnessPlanData>;

export interface FitnessPlanView extends Omit<FitnessPlan, 'startDate' | 'createdAt'> {
  startDate: string;
  createdAt: string;
  currentWeek?: WeeklyScheduleView;
  summary: { total: number; completed: number };
}
```

### `fitness-plan.view.ts`

```typescript
import type { FitnessPlan, FitnessPlanView } from './fitness-plan.types.js';
import * as Queries from './fitness-plan.queries.js';

export function toFitnessPlanView(plan: FitnessPlan): FitnessPlanView {
  return {
    id: plan.id,
    title: plan.title,
    weeks: plan.weeks.map(toWeeklyScheduleView),
    status: plan.status,
    startDate: plan.startDate.toISOString(),
    createdAt: plan.createdAt.toISOString(),
    currentWeek: Queries.getCurrentWeek(plan),
    summary: Queries.getSummary(plan),
  };
}
```

### `get-current-plan.ts` (Use Case)

```typescript
import type { FitnessPlanView } from '@bene/training-core';
import { toFitnessPlanView } from '@bene/training-core';

export type GetCurrentPlanResponse =
  | { hasPlan: false }
  | { hasPlan: true; plan: FitnessPlanView };

export class GetCurrentPlanUseCase {
  async execute(req: Request): Promise<Result<GetCurrentPlanResponse>> {
    const plan = await this.repo.findActive(req.userId);
    
    return Result.ok({
      hasPlan: !!plan,
      plan: plan ? toFitnessPlanView(plan) : undefined,
    });
  }
}
```

---

## Comparison: Old vs New

### Old Pattern (Zod-based)

```typescript
// fitness-plan.presentation.ts (100+ lines)
export const FitnessPlanSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  startDate: z.iso.datetime(),
  // ... 40 more properties duplicated
  summary: z.object({
    total: z.number().int().min(0),
    completed: z.number().int().min(0),
  }),
});

export type FitnessPlanPresentation = z.infer<typeof FitnessPlanSchema>;

export function toFitnessPlanSchema(plan: FitnessPlan): FitnessPlanPresentation {
  // ... mapping
}
```

**Issues**:
- 😞 100+ lines of Zod schema (never validated)
- 😞 Duplicates FitnessPlan properties
- 😞 Schema drift risk (update entity, forget schema)

### New Pattern (Plain TS)

```typescript
// fitness-plan.types.ts (~20 additional lines)
export interface FitnessPlanView extends Omit<FitnessPlan, 'startDate' | 'createdAt'> {
  startDate: string;
  createdAt: string;
  summary: { total: number; completed: number };
}

// fitness-plan.view.ts (~40 lines)
export function toFitnessPlanView(plan: FitnessPlan): FitnessPlanView {
  // ... mapping
}
```

**Benefits**:
- ✅ ~20 lines (vs ~100)
- ✅ DRY (inherits from entity)
- ✅ Type-safe (TS ensures completeness)
- ✅ No drift (changes to entity auto-reflected in view)

---

## Summary

| Aspect | Old (Zod) | New (Plain TS) |
|--------|-----------|----------------|
| **Entity definition** | `types.ts` | `types.ts` |
| **View definition** | `presentation.ts` (Zod schema) | `types.ts` (interface with `Omit`) |
| **Mapper** | `presentation.ts` | `view.ts` |
| **Lines of code** | ~100-150 | ~60 |
| **Validation** | None (never called) | None (not needed) |
| **Type safety** | Zod schema + z.infer | TypeScript utilities |
| **DRY** | ❌ Duplicates fields | ✅ Extends entity |
| **Drift risk** | ⚠️ Manual sync | ✅ Auto-synced |

**Net result**: Simpler, more maintainable code with zero behavioral change.
