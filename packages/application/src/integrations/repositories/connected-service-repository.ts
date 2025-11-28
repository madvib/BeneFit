import { Result } from '@bene/core/shared';
import { ConnectedService } from '@bene/core/integrations';

export interface ConnectedServiceRepository {
  findById(id: string): Promise<Result<ConnectedService>>;
  findByUserId(userId: string): Promise<Result<ConnectedService[]>>;
  save(service: ConnectedService): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
}