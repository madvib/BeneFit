# Gateway Fixtures

Schema-driven test fixtures for all gateway route request/response schemas, generated using `zod-schema-faker` for realistic, varied test data.

## Installation

Dependencies are already installed at the workspace root:
- `zod-schema-faker` - Schema-driven mock generation
- `@faker-js/faker` - Realistic fake data (peer dependency)

## Usage

### Basic Factory Usage

```typescript
import { sendMessageRequestFactory } from '@bene/gateway/__fixtures__';

// Generate a single fixture
const request = sendMessageRequestFactory.build();

// Generate with overrides
const customRequest = sendMessageRequestFactory.build({
  message: 'Custom message content',
});

// Generate multiple fixtures
const requests = sendMessageRequestFactory.buildList(5);

// Generate with custom overrides per item
const customRequests = sendMessageRequestFactory.buildList(3, (index) => ({
  message: `Message ${index + 1}`,
}));
```

### Deterministic Testing

Use `withSeed()` for reproducible test data:

```typescript
import { withSeed, sendMessageRequestFactory } from '@bene/gateway/__fixtures__';

describe('My Test', () => {
  beforeEach(() => {
    withSeed(12345); // Same seed = same data
  });

  it('generates consistent data', () => {
    const request1 = sendMessageRequestFactory.build();
    const request2 = sendMessageRequestFactory.build();
    // Both will have identical data
  });
});
```

### Invalid Data for Error Testing

```typescript
import { createInvalid } from '@bene/gateway/__fixtures__';
import { SendMessageToCoachRequestSchema } from '@bene/coach-domain';

// Generate invalid data by omitting required fields
const invalidRequest = createInvalid(
  SendMessageToCoachRequestSchema.omit({ userId: true }),
  ['message'] // Omit the 'message' field to make it invalid
);

// Use in error handling tests
expect(() => schema.parse(invalidRequest)).toThrow();
```

## Available Fixtures

### Coach Routes
- `sendMessageRequestFactory`
- `dismissCheckInRequestFactory`
- `respondToCheckInRequestFactory`
- `generateWeeklySummaryRequestFactory`
- `getCoachHistoryRequestFactory`
- `triggerProactiveCheckInRequestFactory`

### Workout Routes
- `getUpcomingWorkoutsRequestFactory`
- `getWorkoutHistoryRequestFactory`
- `skipWorkoutRequestFactory`
- `startWorkoutRequestFactory`
- `completeWorkoutRequestFactory`
- `joinMultiplayerWorkoutRequestFactory`
- `addWorkoutReactionRequestFactory`

### Fitness Plan Routes
- `generatePlanFromGoalsRequestFactory`
- `activatePlanRequestFactory`
- `adjustPlanRequestFactory`
- `pausePlanRequestFactory`

### Profile Routes
- `createUserProfileRequestFactory`
- `updateFitnessGoalsRequestFactory`
- `updatePreferencesRequestFactory`
- `updateTrainingConstraintsRequestFactory`

### Integration Routes
- `connectServiceRequestFactory`
- `disconnectServiceRequestFactory`

## Important Notes

### Client-Side Schemas

All fixtures use **client-side schemas** (with `userId`/`userName` omitted) as they appear in the gateway routes. This matches how the actual API is called from the frontend.

Example:
```typescript
// Gateway route uses: SendMessageToCoachRequestSchema.omit({ userId: true })
// Fixture uses the same schema
export const sendMessageRequestFactory = createFactory(
  SendMessageToCoachRequestSchema.omit({ userId: true })
);
```

### Pre-built Fixtures

Each route also exports pre-built fixtures for quick use:

```typescript
import { sendMessageRequest } from '@bene/gateway/__fixtures__';

// Use directly in tests
expect(sendMessageRequest.message).toBeTruthy();
```

## Testing Patterns

### Schema Validation

```typescript
import { sendMessageRequest } from '@bene/gateway/__fixtures__';
import { SendMessageToCoachRequestSchema } from '@bene/coach-domain';

it('should match client schema', () => {
  const clientSchema = SendMessageToCoachRequestSchema.omit({ userId: true });
  expect(() => clientSchema.parse(sendMessageRequest)).not.toThrow();
});
```

### Data Quality

```typescript
it('should have realistic data', () => {
  const request = sendMessageRequestFactory.build();
  
  expect(request.message).toBeTruthy();
  expect(request.message.length).toBeGreaterThan(0);
});
```

### Multiple Variations

```typescript
it('should generate varied data', () => {
  const requests = sendMessageRequestFactory.buildList(10);
  
  // Check that messages are different
  const messages = requests.map(r => r.message);
  const uniqueMessages = new Set(messages);
  expect(uniqueMessages.size).toBeGreaterThan(1);
});
```

## Running Tests

```bash
# Run all gateway tests
pnpm nx test @bene/gateway

# Run specific test file
pnpm nx test @bene/gateway -- coach.test.ts

# Run with coverage
pnpm nx test @bene/gateway --coverage
```
