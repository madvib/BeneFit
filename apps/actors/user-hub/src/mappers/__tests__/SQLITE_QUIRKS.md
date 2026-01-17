# Mapper Test Known SQLite Behaviors

## Issues to be aware of when testing with SQLite:

### 1. **JSON Date Serialization**
**Issue**: Dates inside JSON fields become strings  
**Example**: `{ completedAt: new Date() }` → `{ completedAt: "2024-01-15T11:00:00.000Z" }`

**Fix in tests**: Don't use `.toEqual()` for JSON fields with dates. Check specific fields or serialize dates before comparison.

### 2. **Millisecond Precision Loss** 
**Issue**: SQLite timestamp mode truncates milliseconds  
**Example**: `2026-01-27T10:53:26.590Z` → `2026-01-27T10:53:26.000Z`

**Fix in tests**: Use `.toBeInstanceOf(Date)` or compare with truncated precision, not exact equality.

### 3. **Schema Defaults vs Fixture Defaults**
**Issue**: Fixtures might have different defaults than schema  
**Example**: Fixture has `isActive: false`, schema defaults to `true`

**Fix**: When testing schema defaults, don't override them in fixtures.

### 4. **Current Test Status**
The tests are revealing these expected behaviors. We need to update test assertions to:
- Skip deep equality checks on JSON fields containing dates
- Use date comparisons that tolerate ms truncation
- Test schema defaults separately from fixtures

## Next Steps
We can either:
1. **Accept these limitations** and adjust tests
2. **Use a different DB** for tests (Postgres has better date handling)
3. **Pre-process data** to strip ms before inserting

For now, **option 1** is recommended - adjust tests to handle SQLite's behavior.
