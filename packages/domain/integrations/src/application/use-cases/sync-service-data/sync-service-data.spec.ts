import { describe, it, beforeEach, vi, expect, type Mock } from 'vitest';
import { Result } from '@bene/shared';
import { ConnectedService } from '../../../core/index.js';
import { SyncServiceDataUseCase } from './sync-service-data.js';
import { IntegrationClient } from '../../ports/integration-client.js';
import { EventBus } from '@bene/shared';

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
      serviceType: 'strava' as 'strava' | 'garmin',
      credentials: {
        accessToken: 'access-token-789',
        refreshToken: 'refresh-token-101',
        expiresAt: new Date(Date.now() + 3600000), // Not expired
        scopes: ['read', 'write'],
        tokenType: 'Bearer',
      },
      permissions: {
        readWorkouts: true,
        writeWorkouts: true,
        readHeartRate: true,
        readSleep: true,
        readNutrition: true,
        readBodyMetrics: true,
      },
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
    const serviceId = 'service-456';
    const userId = 'user-123';

    const mockInActiveService: ConnectedService = {
      id: serviceId,
      userId,
      serviceType: 'strava' as 'strava' | 'garmin',
      credentials: {
        accessToken: 'access-token-789',
        refreshToken: 'refresh-token-101',
        expiresAt: new Date(Date.now() + 3600000),
        scopes: ['read', 'write'],
        tokenType: 'Bearer',
      },
      permissions: {
        readWorkouts: true,
        writeWorkouts: true,
        readHeartRate: true,
        readSleep: true,
        readNutrition: true,
        readBodyMetrics: true,
      },
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
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Service is not active');
    }
  });

  it('should fail if no client exists for service type', async () => {
    // Arrange
    const serviceId = 'service-456';
    const userId = 'user-123';

    const mockService: ConnectedService = {
      id: serviceId,
      userId,
      // @ts-expect-error Testing invalid service type
      serviceType: 'nonexistent-service',
      credentials: {
        accessToken: 'access-token-789',
        refreshToken: 'refresh-token-101',
        expiresAt: new Date(Date.now() + 3600000),
        scopes: ['read', 'write'],
        tokenType: 'Bearer',
      },
      permissions: {
        readWorkouts: true,
        writeWorkouts: true,
        readHeartRate: true,
        readSleep: true,
        readNutrition: true,
        readBodyMetrics: true,
      },
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
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('No client for nonexistent-service');
    }
  });

  it('should fail if getting activities fails', async () => {
    // Arrange
    const serviceId = 'service-456';
    const userId = 'user-123';

    const mockService: ConnectedService = {
      id: serviceId,
      userId,
      serviceType: 'strava' as 'strava' | 'garmin',
      credentials: {
        accessToken: 'access-token-789',
        refreshToken: 'refresh-token-101',
        expiresAt: new Date(Date.now() + 3600000), // Not expired
        scopes: ['read', 'write'],
        tokenType: 'Bearer',
      },
      permissions: {
        readWorkouts: true,
        writeWorkouts: true,
        readHeartRate: true,
        readSleep: true,
        readNutrition: true,
        readBodyMetrics: true,
      },
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
