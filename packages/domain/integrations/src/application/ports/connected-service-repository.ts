import { Result } from '@bene/shared-domain';
import { ConnectedService } from '@core/index.js';

export interface ConnectedServiceRepository {
  findById(id: string): Promise<Result<ConnectedService>>;
  findByUserId(userId: string): Promise<Result<ConnectedService[]>>;
  save(service: ConnectedService): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
}
