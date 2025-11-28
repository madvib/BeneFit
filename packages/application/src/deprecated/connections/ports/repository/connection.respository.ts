import { ServiceConnection } from '@bene/core/connections';
import { Repository } from '@bene/core/shared';

// Repository for ServiceConnection domain entity
export interface ServiceConnectionRepository extends Repository<ServiceConnection> {
  getConnectedServices(): Promise<ServiceConnection[]>;
  connectService(id: string): Promise<void>;
  disconnectService(id: string): Promise<void>;
}
