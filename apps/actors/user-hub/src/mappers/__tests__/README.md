# Mapper Test Strategy

## Overview

We use **real database testing** for mapper tests to ensure robustness and catch integration issues early.

## Test Structure

### 1. **Mapper Tests** (DB-Based with Fixtures)
**Location**: `mappers/__tests__/*.mapper.test.ts`

**Purpose**: Test the full transformation cycle through an actual database

**Approach**: 
- ✅ Use domain fixtures to create test data (e.g., `createFitnessPlanFixture()`)
- ✅ Use mappers to convert to DB format
- ✅ Insert into real in-memory SQLite database
- ✅ Read back and verify round-trip integrity

**Why DB instead of mocks?**
- **Not brittle** - Schema drives structure, not manual mocks
- **Catches more bugs** - Tests actual DB behavior (defaults, constraints, etc.)
- **Schema changes** - Automatically reflected in tests
- **Migration issues** - Caught during test setup
- **Fast enough** - In-memory SQLite is very fast

**Example**:
```typescript
it('should maintain data through round-trip', async () => {
  const original = createFitnessPlanFixture({ id: 'test_1' });
  
  // Write to DB
  await db.insert(activeFitnessPlan).values(toDatabase(original));
  
  // Read back
  const dbRow = await db.query.activeFitnessPlan.findFirst({ ... });
  
  // Verify
  const reconstructed = toDomain(dbRow!);
  expect(reconstructed).toEqual(original);
});
```

**What to test**:
- `toDatabase()` - Domain → DB schema transformation
- `toDomain()` - DB schema → Domain transformation  
- Round-trip integrity (Domain → DB → Domain)
- Null/undefined conversion (`??` operator correctness)
- Optional field handling
- Schema defaults are applied correctly

### 2. **Seed Script Tests** (Database Sanity)
**Location**: `data/__tests__/seed.draft.test.ts`

**Purpose**: Verify database setup, migrations, and seeding work correctly

**Approach**:
- ✅ Sets up in-memory database
- ✅ Runs migrations
- ✅ Executes seed script
- ✅ Verifies all tables are populated

**Example**:
```typescript
it('should successfully seed all tables', async () => {
  const { db } = await setupTestDb();
  await seedDraft(db);
  
  const profile = await db.query.profile.findFirst({ ... });
  expect(profile).toBeDefined();
});
```

**What to test**:
- Database setup succeeds
- Migrations run without errors
- Seed script populates all tables
- Data matches expected fixture shapes
- Idempotency (can run seed multiple times)

## Benefits

### Fixture-First Mappers
- **Fast**: No DB setup overhead
- **Focused**: Only tests transformation logic
- **Maintainable**: Fixtures are the single source of truth
- **Isolated**: No test pollution or side effects

### Separate Seed Tests
- **Confidence**: Ensures DB infrastructure works
- **Integration**: Catches schema/migration issues
- **Realistic**: Tests the actual seed data
- **Regression**: Detects if fixtures break DB compatibility

## Migration Guide

To update existing mapper tests:

1. **Remove database setup**:
   ```diff
   - beforeEach(async () => {
   -   const setup = await setupTestDb();
   -   await seedDraft(db);
   - });
   ```

2. **Use fixtures directly**:
   ```diff
   - const plans = await db.query.activeFitnessPlan.findMany();
   - const dbPlan = plans[0];
   + const dbPlan = createFitnessPlanFixture({ id: 'test' });
   ```

3. **Mock DB rows when testing `toDomain()`**:
   ```typescript
   const dbRow: DbActiveFitnessPlan = {
     id: 'plan_1',
     userId: 'user_1',
     // ... other required fields
   };
   const domain = toDomain(dbRow);
   ```

## Examples

See updated tests:
- ✅ `workout-plan.mapper.test.ts` - Full fixture-first example
- ✅ `seed.draft.test.ts` - DB sanity tests

Follow this pattern for:
- `user-profile.mapper.test.ts`
- `completed-workout.mapper.test.ts`
- `coach-conversation.mapper.test.ts`
- `connected-service.mapper.test.ts`
