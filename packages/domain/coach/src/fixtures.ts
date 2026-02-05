// Fixture aggregator for @bene/coach-domain
// This file provides a separate entry point for test fixtures

// Aggregate exports
export * from './core/aggregates/coach-conversation/test/coach-conversation.fixtures.js';

// Value object exports
export * from './core/value-objects/check-in/test/check-in.fixtures.js';
export * from './core/value-objects/coach-action/test/coach-action.fixtures.js';
export * from './core/value-objects/coach-context/test/coach-context.fixtures.js';
export * from './core/value-objects/coach-msg/test/coach-msg.fixtures.js';

// Application layer response builders
export * from './application/use-cases/dismiss-check-in/test/dismiss-check-in.fixture.js';
export * from './application/use-cases/generate-weekly-summary/test/generate-weekly-summary.fixture.js';
export * from './application/use-cases/get-coaching-history/test/get-coaching-history.fixture.js';
export * from './application/use-cases/respond-to-check-in/test/respond-to-check-in.fixture.js';
export * from './application/use-cases/send-message-to-coach/test/send-message-to-coach.fixture.js';
export * from './application/use-cases/trigger-proactive-check-in/test/trigger-proactive-check-in.fixture.js';

