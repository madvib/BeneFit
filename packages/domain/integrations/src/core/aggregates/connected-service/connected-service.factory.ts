import { Guard, Result } from '@bene/domain-shared';
import { OAuthCredentials } from '../../value-objects/oauth-credentials/oauth-credentials.js';
import {
  ServiceMetadata,
  createServiceMetadata,
} from '../../value-objects/service-metadata/service-metadata.js';
import { ServicePermissions } from '../../value-objects/service-permissions/service-permission.js';
import { createInitialSyncStatus } from '../../value-objects/sync-status/sync-status.js';
import { ConnectedService, ServiceType } from './index.js';
import { randomUUID } from 'crypto';

export interface CreateConnectedServiceParams {
  userId: string;
  serviceType: ServiceType;
  credentials: OAuthCredentials;
  permissions: ServicePermissions;
  metadata?: Partial<ServiceMetadata>;
}

export function createConnectedService(
  params: CreateConnectedServiceParams,
): Result<ConnectedService> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefinedBulk([
      { argument: params.userId, argumentName: 'userId' },
      { argument: params.serviceType, argumentName: 'serviceType' },
      { argument: params.credentials, argumentName: 'credentials' },
      { argument: params.permissions, argumentName: 'permissions' },
    ]),
    Guard.againstEmptyString(params.userId, 'userId'),
  ]);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  const now = new Date();

  return Result.ok({
    id: randomUUID(),
    userId: params.userId,
    serviceType: params.serviceType,
    credentials: params.credentials,
    permissions: params.permissions,
    syncStatus: createInitialSyncStatus(),
    metadata: createServiceMetadata(params.metadata || {}),
    isActive: true,
    isPaused: false,
    connectedAt: now,
    updatedAt: now,
  });
}
