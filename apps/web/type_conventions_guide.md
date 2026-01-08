# Type Organization Conventions

## Overview

This document defines WHERE types are defined, exported, and imported across the application. Follow these rules to avoid duplication and maintain consistency.

---

## Type Location Rules

### 1. Entity Schemas → `@bene/shared`

**What**: Core data structures that represent domain entities. These are the shapes that flow through your system.

**Location**: `@bene/shared/schemas/{domain}/`

**When to define here**:
- The type represents a core entity (not request/response specific)
- The type is used by multiple packages/layers
- The type appears in API responses
- The type is used in forms or UI display

**When NOT to define here**:
- Use case specific input/output (define in use case)
- UI-only computed properties (define in frontend)
- Database-specific fields (define in repository layer)

**Examples of what goes here**:
- Entity schemas and their derived types
- Shared type utilities and common patterns

**Do NOT**:
- Copy entity schemas into other packages
- Define request/response schemas here (those belong in use cases)

---

### 2. Constants → `@bene/shared`

**What**: Enums, status values, type unions, magic numbers, configuration values used across the system.

**Location**: `@bene/shared/constants/{domain}/`

**When to define here**:
- Values used by both frontend and backend
- Valid enum values for entity properties
- Status codes or state values
- Type discriminators

**When NOT to define here**:
- Environment-specific config (use env vars)
- Values only used in one place (define inline)

**Do NOT**:
- Create duplicate const arrays in components or use cases
- Define inline when an imported constant exists

---

### 3. Form Schemas → `@bene/shared`

**What**: Validation schemas for user input forms, including field-level validation rules and error messages.

**Location**: `@bene/shared/forms/{domain}/`

**When to define here**:
- Client-side form validation
- Input schemas that need consistent validation across client and server
- Schemas with user-facing error messages

**When NOT to define here**:
- Server-only validation logic (stays in use cases)
- One-off query parameter validation (define in gateway)

**Pattern**: Forms often derive from entity schemas using `.pick()`, `.omit()`, `.extend()`

**Do NOT**:
- Define form schemas in use cases
- Define form schemas in components
- Duplicate validation logic between form schemas and use cases

---

### 4. Use Case Input/Output → Use Case Package

**What**: Request and response schemas specific to a use case's contract.

**Location**: In the use case file itself or adjacent `types.ts`

**When to define here**:
- Input parameters the use case needs
- Output structure the use case returns
- Server-side context fields (userId, timestamps, etc.)

**Pattern**:
```typescript
// Define in use case
export const UseCaseRequestSchema = z.object({
  // ... fields
})

export const UseCaseResponseSchema = z.object({
  // ... may include EntitySchema from @bene/shared
})

export type UseCaseRequest = z.infer<typeof UseCaseRequestSchema>
export type UseCaseResponse = z.infer<typeof UseCaseResponseSchema>
```

**Do NOT**:
- Move these to @bene/shared (they're use case specific)
- Skip validation schema definition (always define the schema)

---

### 5. Client-Safe Types → Gateway Package

**What**: API types exposed to clients, derived from use case types by removing server-only fields and adding HTTP-specific metadata.

**Location**: `gateway/routes/{domain}/types.ts` or similar

**Pattern**:
```typescript
import type { UseCaseRequest, UseCaseResponse } from '@bene/use-case-package'

// Remove server-only fields
export type ClientRequest = Omit<UseCaseRequest, 'userId' | 'timestamp'>

// Add HTTP metadata
export type ClientResponse = UseCaseResponse & {
  pagination?: PaginationMeta
  meta?: ResponseMeta
}
```

**When to define here**:
- Removing sensitive fields from use case types
- Adding pagination/cursor metadata
- Wrapping responses with HTTP context

**Do NOT**:
- Redefine the entire type (use Omit, Pick, extends)
- Add these to @bene/shared (they're transport-specific)

---

### 6. View Models → Frontend Package

**What**: UI-enriched versions of API types with computed display properties, UI state, and presentation logic.

**Location**: `frontend/lib/view-models/` or `frontend/lib/types/`

**When to define here**:
- Adding computed properties for display
- Combining multiple API responses
- Adding UI-specific state (isSelected, isExpanded, etc.)
- Formatting logic specific to views

**Pattern**:
```typescript
import type { EntityType } from '@bene/shared'

export interface EntityViewModel extends EntityType {
  // Computed display properties
  displayLabel: string
  statusColor: string
  
  // UI state
  isSelected?: boolean
}

export function toViewModel(entity: EntityType, context?: UIContext): EntityViewModel {
  return {
    ...entity,
    displayLabel: computeLabel(entity),
    statusColor: getColor(entity.status),
  }
}
```

**Do NOT**:
- Define these in @bene/shared (UI-specific)
- Modify API response types directly

---

## Import Rules

### ✅ Allowed Imports

```typescript
// Frontend imports from shared
import { EntitySchema, CONSTANTS } from '@bene/shared'

// Frontend imports from gateway (for RPC types)
import type { ApiType } from '@gateway/routes'

// Use cases import from shared
import { EntitySchema, FormSchema } from '@bene/shared'

// Gateway imports from use cases
import { UseCaseRequest, UseCaseResponse } from '@use-case/package'

// Gateway imports from shared
import { EntitySchema } from '@bene/shared'
```

### ❌ Forbidden Imports

```typescript
// Frontend NEVER imports use cases directly
import { UseCase } from '@use-case/package' // ❌

// Frontend NEVER imports from domain/repositories
import { Entity } from '@domain/entities' // ❌

// Use cases NEVER import from gateway
import { ClientType } from '@gateway/routes' // ❌

// Shared NEVER imports from use cases or gateway
import { UseCaseRequest } from '@use-case/package' // ❌
```

---

## Decision Tree

**Before creating a new type, ask:**

### 1. "Is this a core entity that flows through the system?"
- **YES** → Check if it exists in `@bene/shared/schemas/`
  - If exists: Import it
  - If not: Add it there

### 2. "Is this a constant/enum used by multiple layers?"
- **YES** → Check if it exists in `@bene/shared/constants/`
  - If exists: Import it
  - If not: Add it there

### 3. "Is this a form validation schema?"
- **YES** → Check if it exists in `@bene/shared/forms/`
  - If exists: Import it
  - If not: Add it there

### 4. "Is this a use case's input or output?"
- **YES** → Define it in the use case file (import entity schemas from shared)

### 5. "Is this derived from a use case type for HTTP transport?"
- **YES** → Define it in gateway using `Omit`, `Pick`, or `&` with the use case type

### 6. "Is this a UI-specific computed/display property?"
- **YES** → Define it in frontend view models

### 7. "Is this a component's props interface?"
- **YES** → Define it inline in the component file or adjacent types.ts

---

## Common Patterns

### Deriving Types (Don't Duplicate)

```typescript
// ✅ GOOD - Derive from existing type
import { EntitySchema } from '@bene/shared'

export const SubsetSchema = EntitySchema.pick({ field1: true, field2: true })
export const ExtendedSchema = EntitySchema.extend({ newField: z.string() })
export type PartialEntity = Partial<Entity>
export type RequiredEntity = Required<Entity>
```

```typescript
// ❌ BAD - Duplicating the definition
export const SubsetSchema = z.object({
  field1: z.string(), // Now duplicated, will drift
  field2: z.number(),
})
```

### Sharing Validation

```typescript
// Use case uses same schema as form for validation
import { CreateFormSchema } from '@bene/shared/forms'

export const CreateUseCaseRequestSchema = CreateFormSchema.extend({
  userId: z.string(), // Add server context
  timestamp: z.date(),
})
```

### View Model Transformation

```typescript
// Frontend transforms API response to view model
import type { Entity } from '@bene/shared'

const apiData: Entity = await fetchData()
const viewModel = toViewModel(apiData, { currentDate: new Date() })
```

---

## Before You Code Checklist

- [ ] Search `@bene/shared` for existing entity schemas
- [ ] Search `@bene/shared/constants` for existing enums/constants
- [ ] Search `@bene/shared/forms` for existing form schemas
- [ ] If type exists, use `Pick`, `Omit`, `Partial`, or `extends` to derive
- [ ] If creating new entity schema, ensure it belongs in shared (multi-use)
- [ ] If creating use case I/O, define in use case file (not shared)
- [ ] If creating view model, define in frontend (not shared)

---

## Anti-Patterns to Avoid

### ❌ Don't: Duplicate entity schemas
```typescript
// Component file
const WorkoutSchema = z.object({ ... }) // Already exists in @bene/shared!
```

### ❌ Don't: Define use case I/O in shared
```typescript
// @bene/shared/requests/get-something.ts
export const GetSomethingRequest = z.object({ ... }) // Belongs in use case!
```

### ❌ Don't: Create inline constants
```typescript
// Component
const STATUSES = ['active', 'inactive'] // Should import from @bene/shared/constants
```

### ❌ Don't: Import use cases in frontend
```typescript
// Frontend
import { GetSomethingUseCase } from '@use-case/package' // Use gateway/RPC instead
```

### ❌ Don't: Add UI properties to shared schemas
```typescript
// @bene/shared/schemas/entity.ts
export const EntitySchema = z.object({
  id: z.string(),
  isSelected: z.boolean(), // UI-specific! Belongs in view model
})
```

---

## Summary

**@bene/shared**:
- Entity schemas (multi-use data structures)
- Constants and enums
- Form validation schemas
- Shared utilities

**Use Case Packages**:
- Use case specific request/response schemas
- Import entity schemas from shared

**Gateway**:
- Client-safe types derived from use case types
- HTTP-specific metadata
- Pagination wrappers

**Frontend**:
- View models with UI context
- Component prop interfaces
- Display logic and computed properties

**Golden Rule**: If you're about to define a type that feels like it might exist somewhere else, search first. If similar types exist in multiple places, consolidate them in `@bene/shared`.