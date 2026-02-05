// Fixture aggregator for @bene/integrations-domain
// This file provides a separate entry point for test fixtures

// Aggregate exports
export * from './core/aggregates/connected-service/test/connected-service.fixtures.js';

// Value object exports
export * from './core/value-objects/oauth-credentials/test/oauth-credentials.fixtures.js';
export * from './core/value-objects/service-metadata/test/service-metadata.fixtures.js';
export * from './core/value-objects/service-permissions/test/service-permissions.fixtures.js';
export * from './core/value-objects/sync-status/test/sync-status.fixtures.js';

// Application layer response builders
export * from './application/use-cases/connect-service/test/connect-service.fixture.js';
export * from './application/use-cases/disconnect-service/test/disconnect-service.fixture.js';
export * from './application/use-cases/get-connected-services/test/get-connected-services.fixture.js';
export * from './application/use-cases/sync-service-data/test/sync-service-data.fixture.js';

