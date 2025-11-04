import { MockServiceConnectionRepository } from '@bene/infrastructure/connections';
import { GetAvailableServicesUseCase, ConnectServiceUseCase, DisconnectServiceUseCase } from '@bene/application/connections';

// Create repository instance
const serviceConnectionRepository = new MockServiceConnectionRepository();

// Instantiate connections use cases as constants
export const getAvailableServicesUseCase = new GetAvailableServicesUseCase(serviceConnectionRepository);
export const connectServiceUseCase = new ConnectServiceUseCase(serviceConnectionRepository);
export const disconnectServiceUseCase = new DisconnectServiceUseCase(serviceConnectionRepository);

// Export all connections-related use cases
export const connectionsUseCases = {
  getAvailableServicesUseCase,
  connectServiceUseCase,
  disconnectServiceUseCase,
};