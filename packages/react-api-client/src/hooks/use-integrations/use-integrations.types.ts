import type { GetConnectedServicesResponse } from './use-integrations';

export type ConnectedService = GetConnectedServicesResponse['services'][number];
export type ConnectedServiceMetadata = ConnectedService['metadata'];
export type ConnectedServiceStatus = ConnectedService['status'];
