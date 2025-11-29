// Export all parts of the ConnectedService aggregate
export type { ConnectedService, ServiceType } from './connected-service.types.js';
export { createConnectedService } from './connected-service.factory.js';
export * as ConnectedServiceCommands from './connected-service.commands.js';
export * as ConnectedServiceQueries from './connected-service.queries.js';