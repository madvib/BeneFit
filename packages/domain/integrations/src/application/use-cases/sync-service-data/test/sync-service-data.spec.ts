import { describe, it, beforeEach, vi, expect, type Mock } from 'vitest';

import { Result, EventBus } from '@bene/shared';

import { IntegrationClient } from '@/application/ports/integration-client.js';
import { createConnectedServiceFixture } from '@/fixtures.js';

import { SyncServiceDataUseCase } from '../sync-service-data.js';

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

const mockIntegrationClient = {
  supportsWebhooks: true,
  exchangeAuthCode: vi.fn(),
  refreshAccessToken: vi.fn(),
  getUserProfile: vi.fn(),
  getActivitiesSince: vi.fn(),
} as unknown as {
  supportsWebhooks: boolean;
  exchangeAuthCode: Mock;
  refreshAccessToken: Mock;
  getUserProfile: Mock;
  getActivitiesSince: Mock;
};

const SERVICE_TYPE = 'strava';
const mockIntegrationClients = new Map<string, IntegrationClient>();
mockIntegrationClients.set(SERVICE_TYPE, mockIntegrationClient);

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;

describe('SyncServiceDataUseCase', () => {
  let useCase: SyncServiceDataUseCase;
  const TEST_USER_ID = crypto.randomUUID();
  const TEST_SERVICE_ID = crypto.randomUUID();

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new SyncServiceDataUseCase(
      mockServiceRepository,
      mockIntegrationClients,
      mockEventBus,
    );
  });

  it('should successfully sync service data', async () => {
    // Arrange
    const serviceId = TEST_SERVICE_ID;
    const userId = TEST_USER_ID;

    const mockService = createConnectedServiceFixture({
      id: serviceId,
      userId,
      serviceType: SERVICE_TYPE,
      isActive: true,
      isPaused: false,
    });

    const mockActivities = [
      { id: 'activity-1', type: 'workout', name: 'Morning Run' },
      { id: 'activity-2', type: 'activity', name: 'Afternoon Walk' },
    ];

    mockServiceRepository.findById.mockResolvedValue(Result.ok(mockService));
    mockIntegrationClient.getActivitiesSince.mockResolvedValue(
      Result.ok(mockActivities),
    );
    mockServiceRepository.save.mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      serviceId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.serviceId).toBe(serviceId);
      expect(result.value.success).toBe(true);
      expect(result.value.activitiesSynced).toBe(2);
    }
    expect(mockServiceRepository.save).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'ActivitiesSynced',
        userId,
        serviceId,
        serviceType: SERVICE_TYPE,
      }),
    );
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'ServiceSynced',
        userId,
        serviceId,
        workoutsSynced: 0,
      }),
    );
  });

  it('should fail if service is not found', async () => {
    // Arrange
    const serviceId = TEST_SERVICE_ID;

    mockServiceRepository.findById.mockResolvedValue(
      Result.fail(new Error('Service not found')),
    );

    // Act
    const result = await useCase.execute({
      serviceId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Service not found');
    }
  });

  it('should fail if service is not active', async () => {
    // Arrange
    const serviceId = TEST_SERVICE_ID;
    const userId = TEST_USER_ID;

    const mockInActiveService = createConnectedServiceFixture({
      id: serviceId,
      userId,
      serviceType: SERVICE_TYPE,
      isActive: false,
      isPaused: true,
    });

    mockServiceRepository.findById.mockResolvedValue(Result.ok(mockInActiveService));

    // Act
    const result = await useCase.execute({
      serviceId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Service is not active');
    }
  });

  it('should fail if no client exists for service type', async () => {
    // Arrange
    const serviceId = TEST_SERVICE_ID;
    const userId = TEST_USER_ID;

    const mockService = createConnectedServiceFixture({
      id: serviceId,
      userId,
      // @ts-expect-error Testing invalid service type
      serviceType: 'nonexistent-service',
      isActive: true,
      isPaused: false,
    });

    mockServiceRepository.findById.mockResolvedValue(Result.ok(mockService));

    // Act
    const result = await useCase.execute({
      serviceId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('No client for nonexistent-service');
    }
  });

  it('should fail if getting activities fails', async () => {
    // Arrange
    const serviceId = TEST_SERVICE_ID;
    const userId = TEST_USER_ID;

    const mockService = createConnectedServiceFixture({
      id: serviceId,
      userId,
      serviceType: SERVICE_TYPE,
      isActive: true,
      isPaused: false,
    });

    mockServiceRepository.findById.mockResolvedValue(Result.ok(mockService));
    mockIntegrationClient.getActivitiesSince.mockResolvedValue(
      Result.fail(new Error('API error')),
    );
    mockServiceRepository.save.mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      serviceId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toContain('API error');
    }
  });
});
