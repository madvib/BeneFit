21.1.26
# Guide: Adding Result<T> + Fuzzing to Use Case Fixtures

## Overview

This guide shows how to upgrade use case fixtures to return `Result<T>` with fuzzing capabilities, using the pattern established in `coach-domain`.

## The Pattern

### 1. Basic Result<T> Wrapper

**Before** (plain return):
```typescript
export function buildActivatePlanResponse(overrides?) {
  return {
    planId: faker.string.uuid(),
    activatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}
```

**After** (with Result<T>):
```typescript
import { Result } from '@bene/shared';

export interface ActivatePlanFixtureOptions {
  success?: boolean;
  temperature?: number; // 0-1, probability of failure
}

export function buildActivatePlanResponse(
  overrides?,
  options?: ActivatePlanFixtureOptions
): Result<ActivatePlanResponse> {
  // Fuzzing: probabilistic failure
  if (options?.temperature && Math.random() < options.temperature) {
    return Result.fail('Plan activation failed due to constraints');
  }

  // Deterministic failure
  if (options?.success === false) {
    return Result.fail('Simulated activation failure');
  }

  // Success path
  return Result.ok({
    planId: faker.string.uuid(),
    activatedAt: faker.date.recent().toISOString(),
    ...overrides,
  });
}
```

### 2. Compose with Domain Fixtures

Use existing domain fixtures for realistic data:

```typescript
import { createPlanTemplateFixture } from '../../core/aggregates/plan-template/test/plan-template.fixtures.js';
import { toPlanTemplateView } from '../../core/aggregates/plan-template/plan-template.view.js';

export function buildActivatePlanResponse(
  overrides?,
  options?: ActivatePlanFixtureOptions
): Result<ActivatePlanResponse> {
  if (options?.temperature && Math.random() < options.temperature) {
    return Result.fail('Plan activation failed');
  }

  if (options?.success === false) {
    return Result.fail('Simulated failure');
  }

  // Generate realistic plan using domain fixture
  const planTemplate = createPlanTemplateFixture();
  
  return Result.ok({
    plan: toPlanTemplateView(planTemplate),
    activatedAt: faker.date.recent().toISOString(),
    ...overrides,
  });
}
```

### 3. Different Failure Modes

For more sophisticated testing, support multiple failure types:

```typescript
export interface ActivatePlanFixtureOptions {
  success?: boolean;
  temperature?: number;
  failureType?: 'constraints' | 'notFound' | 'alreadyActive';
}

export function buildActivatePlanResponse(
  overrides?,
  options?: ActivatePlanFixtureOptions
): Result<ActivatePlanResponse> {
  // Fuzzing
  if (options?.temperature && Math.random() < options.temperature) {
    const failures = ['constraints', 'notFound', 'alreadyActive'];
    const randomFailure = failures[Math.floor(Math.random() * failures.length)];
    return Result.fail(getErrorMessage(randomFailure));
  }

  // Deterministic failure by type
  if (options?.success === false) {
    return Result.fail(getErrorMessage(options.failureType || 'constraints'));
  }

  // Success
  const plan = createPlanTemplateFixture();
  return Result.ok({
    plan: toPlanTemplateView(plan),
    activatedAt: faker.date.recent().toISOString(),
    ...overrides,
  });
}

function getErrorMessage(type: string): string {
  switch (type) {
    case 'constraints': return 'User constraints prevent plan activation';
    case 'notFound': return 'Plan template not found';
    case 'alreadyActive': return 'User already has an active plan';
    default: return 'Plan activation failed';
  }
}
```

## Migration Strategy

### Step 1: Pick One Use Case

Start with a single use case to validate the pattern:

```bash
# Example: activate-fitness-plan
packages/domain/training/application/src/use-cases/activate-fitness-plan/test/
```

### Step 2: Add Options Type

```typescript
export interface ActivatePlanFixtureOptions {
  success?: boolean;
  temperature?: number;
}
```

### Step 3: Update Return Type

```typescript
// Before
export function buildActivatePlanResponse(...)

// After  
export function buildActivatePlanResponse(
  overrides?,
  options?: ActivatePlanFixtureOptions
): Result<ActivatePlanResponse>
```

### Step 4: Add Fuzzing Logic

```typescript
export function buildActivatePlanResponse(
  overrides?,
  options?: ActivatePlanFixtureOptions
): Result<ActivatePlanResponse> {
  // 1. Handle fuzzing
  if (options?.temperature && Math.random() < options.temperature) {
    return Result.fail('Activation failed');
  }

  // 2. Handle deterministic failure
  if (options?.success === false) {
    return Result.fail('Simulated failure');
  }

  // 3. Success path (existing logic)
  return Result.ok({
    // ... existing fixture data
  });
}
```

### Step 5: Update HTTP Response Builder

Update [react-api-client/src/fixtures/training.ts](file:///home/madvib/dev/bene/packages/react-api-client/src/fixtures/training.ts):

```typescript
export function buildActivatePlanResponse(
  overrides?,
  options?: FixtureOptions & ActivatePlanFixtureOptions
) {
  applySeed(options);

  const result = _buildActivatePlanResponse(overrides, {
    success: options?.success,
    temperature: options?.temperature,
  });

  if (result.isFailure) {
    throw new Error(`[Fixture] Activation failed: ${result.errorMessage}`);
  }

  return result.value;
}

// Export raw builder for testing failures
export {
  _buildActivatePlanResponse as buildActivatePlanResponseRaw,
};
```

### Step 6: Use in Tests

```typescript
// Success
const response = buildActivatePlanResponse();
expect(response.isSuccess).toBe(true);

// Deterministic failure
const failure = buildActivatePlanResponse(undefined, { success: false });
expect(failure.isFailure).toBe(true);

// Fuzzing (10% failure rate)
const fuzzy = buildActivatePlanResponse(undefined, { temperature: 0.1 });
// Will randomly succeed or fail
```

## Examples by Use Case Type

### Query (GET)

```typescript
export function buildGetWorkoutHistoryResponse(
  overrides?,
  options?: { success?: boolean; temperature?: number }
): Result<GetWorkoutHistoryResponse> {
  if (options?.temperature && Math.random() < options.temperature) {
    return Result.fail('Failed to fetch workout history');
  }

  if (options?.success === false) {
    return Result.fail('Simulated fetch failure');
  }

  // Generate realistic history
  const workouts = Array.from({ length: 5 }, () =>
    createCompletedWorkoutFixture()
  );

  return Result.ok({
    workouts: workouts.map(toCompletedWorkoutView),
    totalCount: workouts.length,
    ...overrides,
  });
}
```

### Command (POST with side effects)

```typescript
export function buildCompleteWorkoutResponse(
  overrides?,
  options?: { success?: boolean; temperature?: number; failureType?: 'timeout' | 'invalidData' }
): Result<CompleteWorkoutResponse> {
  if (options?.temperature && Math.random() < options.temperature) {
    return Result.fail('Workout completion failed');
  }

  if (options?.success === false) {
    const msg = options.failureType === 'timeout'
      ? 'Workout session timed out'
      : 'Invalid workout data';
    return Result.fail(msg);
  }

  const workout = createCompletedWorkoutFixture();
  const achievement = Math.random() > 0.7 ? createAchievementFixture() : undefined;

  return Result.ok({
    workout: toCompletedWorkoutView(workout),
    achievement,
    stats: {
      totalWorkouts: faker.number.int({ min: 10, max: 100 }),
      currentStreak: faker.number.int({ min: 1, max: 30 }),
    },
    ...overrides,
  });
}
```

## Testing the Fixtures

```typescript
describe('buildActivatePlanResponse', () => {
  it('returns success by default', () => {
    const result = buildActivatePlanResponse();
    expect(result.isSuccess).toBe(true);
    expect(result.value).toHaveProperty('plan');
  });

  it('returns deterministic failure', () => {
    const result = buildActivatePlanResponse(undefined, { success: false });
    expect(result.isFailure).toBe(true);
  });

  it('fuzzing generates some failures', () => {
    const results = Array.from({ length: 100 }, () =>
      buildActivatePlanResponse(undefined, { temperature: 0.3 })
    );
    
    const failures = results.filter(r => r.isFailure).length;
    expect(failures).toBeGreaterThan(10); // ~30% failure rate
    expect(failures).toBeLessThan(50);
  });
});
```

## Checklist

- [ ] Add `XYZFixtureOptions` type
- [ ] Change return type to `Result<XYZResponse>`
- [ ] Add fuzzing logic with `temperature`
- [ ] Add deterministic failure with `success: false`
- [ ] Use domain fixtures for realistic data
- [ ] Update HTTP response builder in `react-api-client`
- [ ] Export raw builder for advanced usage
- [ ] Test success, failure, and fuzzing modes
