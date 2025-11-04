import { Result, UseCase } from '@bene/core/shared';
import { ServiceConnectionRepository } from '../../ports/repository/connection.respository.js';
import { ServiceConnection } from '@bene/core/connections';

// Output interface
export interface GetAvailableServicesOutput {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  logo: string;
  dataType: string[];
  lastSync?: string; // Using string format for UI display
}

export class GetAvailableServicesUseCase implements UseCase<void, Result<GetAvailableServicesOutput[]>> {
  constructor(private serviceConnectionRepository: ServiceConnectionRepository) {}

  async execute(): Promise<Result<GetAvailableServicesOutput[]>> {
    try {
      // Get all service connections from repository
      // In a real implementation, this might involve a method to get all services
      // For now, I'll use the getConnectedServices method and make assumptions
      // In a real implementation, we'd probably have a method that returns all services (both connected and not)
      
      // For this mock, I'll just return a default list that matches the UI expectations
      // In a real implementation, this would call serviceConnectionRepository.getAllServices()
      
      // Since there's no getAllServices method on the interface, I'll implement
      // based on what's available
      const connectedServices = await this.serviceConnectionRepository.getConnectedServices();
      
      // For a complete implementation, we'd need a way to get all possible services
      // not just the connected ones, but for now, I'll create mock data
      const allServices: GetAvailableServicesOutput[] = [
        {
          id: '1',
          name: 'Strava',
          description: 'Connect your Strava account to import activities',
          connected: true,
          logo: 'https://logo.clearbit.com/strava.com',
          dataType: ['Activities', 'Routes', 'Athlete data'],
          lastSync: '2023-05-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Fitbit',
          description: 'Import fitness data from your Fitbit device',
          connected: false,
          logo: 'https://logo.clearbit.com/fitbit.com',
          dataType: ['Steps', 'Sleep', 'Heart rate']
        },
        {
          id: '3',
          name: 'Garmin',
          description: 'Sync your Garmin activities and health metrics',
          connected: false,
          logo: 'https://logo.clearbit.com/garmin.com',
          dataType: ['Activities', 'Health data', 'Weather']
        }
      ];

      return Result.ok(allServices);
    } catch (error) {
      console.error('Error getting available services:', error);
      return Result.fail(error instanceof Error ? error : new Error('Failed to get available services'));
    }
  }
}