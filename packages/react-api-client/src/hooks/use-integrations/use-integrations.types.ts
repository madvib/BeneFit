import type { GetConnectedServicesResponse } from './use-integrations';

export type ConnectedService = GetConnectedServicesResponse['services'][number];
export type ConnectedServiceMetadata = ConnectedService['metadata'];
export type ConnectedServiceSyncStatus = ConnectedService['syncStatus'];
