import { describe, it, beforeEach, vi, expect, type Mock } from 'vitest';
import { randomUUID } from 'node:crypto';

import { Result } from '@bene/shared';

import {
  createConnectedServiceFixture,
  createSyncStatusFixture,
  createServiceMetadataFixture
} from '@/fixtures.js';

import { GetConnectedServicesUseCase } from '../get-connected-services.js';

// Mock repositories and services
const mockServiceRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} as unknown as {
  findById: Mock;
  findByUserId: Mock;
  save: Mock;
  delete: Mock;
};

const SERVICE_TYPE = 'strava';

describe('GetConnectedServicesUseCase', () => {
  const TEST_USER_ID = crypto.randomUUID();

  let useCase: GetConnectedServicesUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetConnectedServicesUseCase(mockServiceRepository);
  });

  it('should successfully get connected services', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const serviceId = crypto.randomUUID();
    const externalUserId = 'test-external-user-id';

    const mockService = createConnectedServiceFixture({
      id: serviceId,
      userId,
      serviceType: SERVICE_TYPE,
      syncStatus: createSyncStatusFixture({ state: 'synced' }),
      metadata: createServiceMetadataFixture({ externalUserId }),
      isActive: true,
      isPaused: false,
    });

    mockServiceRepository.findByUserId.mockResolvedValue(Result.ok([mockService]));

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.services).toHaveLength(1);
      const service = result.value.services[0];
      if (service) {
        expect(service.id).toBe(serviceId);
        expect(service.serviceType).toBe(SERVICE_TYPE);
        expect(service.isActive).toBe(true);
        expect(service.isPaused).toBe(false);
        expect(service.syncStatus.state).toBe('synced');
        expect(service.lastSyncAt).toBeDefined();
      }
    }
  });

  it('should return empty array if no services are found', async () => {
    // Arrange
    const userId = TEST_USER_ID;

    mockServiceRepository.findByUserId.mockResolvedValue(Result.ok([]));

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.services).toHaveLength(0);
    }
  });

  it('should fail if repository call fails', async () => {
    // Arrange
    const userId = TEST_USER_ID;

    mockServiceRepository.findByUserId.mockResolvedValue(
      Result.fail(new Error('Database error')),
    );

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Database error');
    }
  });
});
