import { RpcTarget } from 'cloudflare:workers';
import { UseCaseFactory } from '../factories/use-case-factory';
import {
  ConnectServiceRequest,
  DisconnectServiceRequest,
  GetConnectedServicesRequest,
  SyncServiceDataRequest
} from '@bene/integrations-domain';

export class IntegrationsFacade extends RpcTarget {
  constructor(private useCaseFactory: UseCaseFactory) {
    super();
  }

  async connect(input: ConnectServiceRequest) {
    const result = await this.useCaseFactory.getConnectServiceUseCase().execute(input);
    return result.serialize();
  }

  async disconnect(input: DisconnectServiceRequest) {
    const result = await this.useCaseFactory.getDisconnectServiceUseCase().execute(input);
    return result.serialize();
  }

  async getConnectedServices(input: GetConnectedServicesRequest) {
    const result = await this.useCaseFactory.getGetConnectedServicesUseCase().execute(input);
    return result.serialize();
  }

  async sync(input: SyncServiceDataRequest) {
    const result = await this.useCaseFactory.getSyncServiceDataUseCase().execute(input);
    return result.serialize();
  }
}
