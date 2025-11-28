import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/core/shared';
import { ConnectedService } from '@bene/core/integrations';
import { SyncServiceDataUseCase } from './sync-service-data';
import { ConnectedServiceRepository } from '../../repositories/connected-service-repository';
import { IntegrationClient } from '../../services/integration-client';
import { EventBus } from '../../../shared/event-bus.js';

// Mock repositories and services
const mockServiceRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} as unknown as ConnectedServiceRepository;

const mockIntegrationClient = {
  supportsWebhooks: true,
  exchangeAuthCode: vi.fn(),
  refreshAccessToken: vi.fn(),
  getUserProfile: vi.fn(),
  getActivitiesSince: vi.fn(),
} as unknown as IntegrationClient;

const mockIntegrationClients = new Map<string, IntegrationClient>();
mockIntegrationClients.set('strava', mockIntegrationClient);

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;

describe('SyncServiceDataUseCase', () => {
  let useCase: SyncServiceDataUseCase;

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
    const serviceId = 'service-456';
    const userId = 'user-123';

    const mockService: ConnectedService = {
      id: serviceId,
      userId,
      serviceType: 'strava' as any,
      credentials: {
        accessToken: 'access-token-789',
        refreshToken: 'refresh-token-101',
        expiresAt: new Date(Date.now() + 3600000), // Not expired
        scopes: ['read', 'write'],
        tokenType: 'Bearer',
      },
      permissions: { read: true, write: true },
      syncStatus: {
        state: 'synced',
        lastAttemptAt: new Date(),
        lastSuccessAt: new Date(),
        error: undefined,
        consecutiveFailures: 0,
        activitiesSynced: 10,
        workoutsSynced: 5,
        heartRateDataSynced: 3,
      },
      metadata: {
        externalUserId: 'external-123',
        externalUsername: 'john_doe',
        profileUrl: 'https://strava.com/athlete/123',
        units: 'metric',
        supportsWebhooks: true,
        webhookRegistered: false,
      },
      isActive: true,
      isPaused: false,
      connectedAt: new Date(),
      updatedAt: new Date(),
    };

    const mockActivities = [
      { id: 'act-1', type: 'workout', name: 'Morning Run' },
      { id: 'act-2', type: 'activity', name: 'Evening Walk' },
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
      expect(result.value.workoutsSynced).toBe(1); // Only 1 workout
      expect(result.value.activitiesSynced).toBe(2); // 2 total activities
    }
    expect(mockServiceRepository.save).toHaveBeenCalled(); // Called for startSync and recordSyncSuccess
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ServiceSynced',
        userId,
        serviceId,
        workoutsSynced: 1,
      }),
    );
  });

  it('should fail if service is not found', async () => {
    // Arrange
    const serviceId = 'service-456';

    mockServiceRepository.findById.mockResolvedValue(Result.fail('Service not found'));

    // Act
    const result = await useCase.execute({
      serviceId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBe('Service not found');
    }
  });

  it('should fail if service is not active', async () => {
    // Arrange
    const serviceId = 'service-456';
    const userId = 'user-123';

    const mockInActiveService: ConnectedService = {
      id: serviceId,
      userId,
      serviceType: 'strava' as any,
      credentials: {
        accessToken: 'access-token-789',
        refreshToken: 'refresh-token-101',
        expiresAt: new Date(Date.now() + 3600000),
        scopes: ['read', 'write'],
        tokenType: 'Bearer',
      },
      permissions: { read: true, write: true },
      syncStatus: {
        state: 'never_synced',
        lastAttemptAt: undefined,
        lastSuccessAt: undefined,
        error: undefined,
        consecutiveFailures: 0,
        activitiesSynced: 0,
        workoutsSynced: 0,
        heartRateDataSynced: 0,
      },
      metadata: {
        externalUserId: 'external-123',
        externalUsername: 'john_doe',
        profileUrl: 'https://strava.com/athlete/123',
        units: 'metric',
        supportsWebhooks: true,
        webhookRegistered: false,
      },
      isActive: false, // Not active
      isPaused: true,
      connectedAt: new Date(),
      updatedAt: new Date(),
    };

    mockServiceRepository.findById.mockResolvedValue(Result.ok(mockInActiveService));

    // Act
    const result = await useCase.execute({
      serviceId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBe('Service is not active');
    }
  });

  it('should fail if no client exists for service type', async () => {
    // Arrange
    const serviceId = 'service-456';
    const userId = 'user-123';

    const mockService: ConnectedService = {
      id: serviceId,
      userId,
      serviceType: 'nonexistent-service' as any,
      credentials: {
        accessToken: 'access-token-789',
        refreshToken: 'refresh-token-101',
        expiresAt: new Date(Date.now() + 3600000),
        scopes: ['read', 'write'],
        tokenType: 'Bearer',
      },
      permissions: { read: true, write: true },
      syncStatus: {
        state: 'synced',
        lastAttemptAt: new Date(),
        lastSuccessAt: new Date(),
        error: undefined,
        consecutiveFailures: 0,
        activitiesSynced: 10,
        workoutsSynced: 5,
        heartRateDataSynced: 3,
      },
      metadata: {
        externalUserId: 'external-123',
        externalUsername: 'john_doe',
        profileUrl: 'https://strava.com/athlete/123',
        units: 'metric',
        supportsWebhooks: true,
        webhookRegistered: false,
      },
      isActive: true,
      isPaused: false,
      connectedAt: new Date(),
      updatedAt: new Date(),
    };

    mockServiceRepository.findById.mockResolvedValue(Result.ok(mockService));

    // Act
    const result = await useCase.execute({
      serviceId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBe('No client for nonexistent-service');
    }
  });

  it('should fail if getting activities fails', async () => {
    // Arrange
    const serviceId = 'service-456';
    const userId = 'user-123';

    const mockService: ConnectedService = {
      id: serviceId,
      userId,
      serviceType: 'strava' as any,
      credentials: {
        accessToken: 'access-token-789',
        refreshToken: 'refresh-token-101',
        expiresAt: new Date(Date.now() + 3600000), // Not expired
        scopes: ['read', 'write'],
        tokenType: 'Bearer',
      },
      permissions: { read: true, write: true },
      syncStatus: {
        state: 'synced',
        lastAttemptAt: new Date(),
        lastSuccessAt: new Date(),
        error: undefined,
        consecutiveFailures: 0,
        activitiesSynced: 10,
        workoutsSynced: 5,
        heartRateDataSynced: 3,
      },
      metadata: {
        externalUserId: 'external-123',
        externalUsername: 'john_doe',
        profileUrl: 'https://strava.com/athlete/123',
        units: 'metric',
        supportsWebhooks: true,
        webhookRegistered: false,
      },
      isActive: true,
      isPaused: false,
      connectedAt: new Date(),
      updatedAt: new Date(),
    };

    mockServiceRepository.findById.mockResolvedValue(Result.ok(mockService));
    mockIntegrationClient.getActivitiesSince.mockResolvedValue(
      Result.fail('API error'),
    );
    mockServiceRepository.save.mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      serviceId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toContain('API error');
    }
  });
});
