import { Result, UseCase } from '@bene/core/shared';
import { ServiceConnectionRepository } from '../../ports/repository/connection.respository.js';

interface ConnectServiceInput {
  serviceId: string;
}

interface ConnectServiceOutput {
  success: boolean;
  message?: string;
}

export class ConnectServiceUseCase implements UseCase<ConnectServiceInput, ConnectServiceOutput> {
  constructor(private serviceConnectionRepository: ServiceConnectionRepository) {}

  async execute(input: ConnectServiceInput): Promise<Result<ConnectServiceOutput>> {
    try {
      // In a real implementation, this would trigger the OAuth flow
      // For now, we just update the service status
      
      await this.serviceConnectionRepository.connectService(input.serviceId);

      return Result.ok({
        success: true,
        message: 'Service connected successfully'
      });
    } catch (error) {
      console.error('Error connecting service:', error);
      return Result.fail(error instanceof Error ? error : new Error('Failed to connect service'));
    }
  }
}