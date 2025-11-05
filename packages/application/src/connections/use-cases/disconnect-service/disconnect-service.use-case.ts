import { Result, UseCase } from '@bene/core/shared';
import { ServiceConnectionRepository } from '../../ports/repository/connection.respository.js';

interface DisconnectServiceInput {
  serviceId: string;
}

interface DisconnectServiceOutput {
  success: boolean;
  message?: string;
}

export class DisconnectServiceUseCase implements UseCase<DisconnectServiceInput, DisconnectServiceOutput> {
  constructor(private serviceConnectionRepository: ServiceConnectionRepository) {}

  async execute(input: DisconnectServiceInput): Promise<Result<DisconnectServiceOutput>> {
    try {
      await this.serviceConnectionRepository.disconnectService(input.serviceId);

      return Result.ok({
        success: true,
        message: 'Service disconnected successfully'
      });
    } catch (error) {
      console.error('Error disconnecting service:', error);
      return Result.fail(error instanceof Error ? error : new Error('Failed to disconnect service'));
    }
  }
}