import { UseCaseFactory } from '../factories/use-case-factory';
import {
  ConnectServiceRequest,
  DisconnectServiceRequest,
  GetConnectedServicesRequest,
  SyncServiceDataRequest
} from '@bene/integrations-domain';

export class IntegrationsFacade {
  constructor(private useCaseFactory: UseCaseFactory) { }

  async connect(input: ConnectServiceRequest) {
    const uc = this.useCaseFactory.getConnectServiceUseCase();
    return await uc.execute(input);
  }

  async disconnect(input: DisconnectServiceRequest) {
    const uc = this.useCaseFactory.getDisconnectServiceUseCase();
    return await uc.execute(input);
  }

  async getConnectedServices(input: GetConnectedServicesRequest) {
    const uc = this.useCaseFactory.getGetConnectedServicesUseCase();
    return await uc.execute(input);
  }

  async sync(input: SyncServiceDataRequest) {
    const uc = this.useCaseFactory.getSyncServiceDataUseCase();
    return await uc.execute(input);
  }
}
