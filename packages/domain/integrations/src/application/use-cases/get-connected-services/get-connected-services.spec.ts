import { describe, it, beforeEach, vi, expect, type Mock } from 'vitest';
import { Result } from '@bene/domain-shared';
import { ConnectedService } from '../../../core/index.js';
import { GetConnectedServicesUseCase } from './get-connected-services.js';

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

describe('GetConnectedServicesUseCase', () => {
  let useCase: GetConnectedServicesUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetConnectedServicesUseCase(mockServiceRepository);
  });

  it('should successfully get connected services', async () => {
    // Arrange
    const userId = 'user-123';

    const mockService: ConnectedService = {
      id: 'service-456',
      userId,
      serviceType: 'strava' as 'strava' | 'garmin',
      credentials: {
        accessToken: 'access-token-789',
        refreshToken: 'refresh-token-101',
        expiresAt: new Date(Date.now() + 3600000),
        scopes: ['read', 'write'],
        tokenType: 'Bearer',
      },
      permissions: { readWorkouts: true, writeWorkouts: true, readHeartRate: true, readSleep: true, readNutrition: true, readBodyMetrics: true },
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
      lastSyncAt: new Date(),
    };

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
        expect(service.id).toBe('service-456');
        expect(service.serviceType).toBe('strava');
        expect(service.isActive).toBe(true);
        expect(service.isPaused).toBe(false);
        expect(service.syncStatus).toBe('synced');
        expect(service.lastSyncAt).toBeDefined();
      }
    }
  });

  it('should return empty array if no services are found', async () => {
    // Arrange
    const userId = 'user-123';

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
    const userId = 'user-123';

    mockServiceRepository.findByUserId.mockResolvedValue(Result.fail(new Error('Database error')));

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
