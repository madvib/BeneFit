# Validation Strategy: Guards vs. Schemas vs. Views

**Status**: In Discussion
**Date**: 2026-01-17

## The Dilemma

We faced a conflict between "cleaning up presentation files" and "needing schemas for Request DTOs".

1.  **Guards**: Used in Domain Factories to ensure domain invariants. Hand-written, precise, coupled to domain logic.
2.  **Schemas (Zod)**: Used for API Request validation (Gateways, Controllers) and API Response definition (View Models). Declarative, easy to serialize, coupled to IO.

## The Solution

We explicitly separate **Presentation (Views)** from **Validation (Schemas)** within the Domain.

### 1. `*.schema.ts` (Request Validation)
*   **Purpose**: Defines the shape of **inputs** (Requests, DTOs) entering the domain.
*   **Location**: Colocated with Domain Value Objects (e.g., `plan-goals.schema.ts`).
*   **Usage**:
    *   **Gateways/Controllers**: Validate incoming JSON against this schema before passing to Use Cases.
    *   **Factories**: (Optional but recommended) Logic can delegate to these schemas for structural validation to avoid duplication (e.g., `min(1)` strings).

### 2. `*.view.ts` or `*View` interfaces (Response Presentation)
*   **Purpose**: Defines the shape of **outputs** (Responses) leaving the domain.
*   **Location**: `*.types.ts` (interfaces) or `*.mapper.ts` (logic).
*   **Usage**: Mappers convert Domain Entities to these Views.

### 3. Factory Guards (Domain Invariants)
*   **Purpose**: Semantic and state-based validation that Zod cannot easily express.
*   **Usage**: Always run in the Factory *after* (or alongside) structural validation.

---

## Migration Note
We renamed `*.presentation.ts` files in Value Objects to `*.schema.ts` to reflect that they define the *Input Schema* for these concepts, not necessarily the *Output View*.
