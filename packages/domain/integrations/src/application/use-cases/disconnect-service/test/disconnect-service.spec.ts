import { describe, it, beforeEach, vi, expect, type Mock } from 'vitest';
import { Result } from '@bene/shared';
import { ConnectedService } from '../../../../core/index.js';
import { DisconnectServiceUseCase } from '../disconnect-service.js';
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

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;

describe('DisconnectServiceUseCase', () => {
  let useCase: DisconnectServiceUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new DisconnectServiceUseCase(mockServiceRepository, mockEventBus);
  });

  it('should successfully disconnect a service', async () => {
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const serviceId = 'service-456';

    const mockService: ConnectedService = {
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
    mockServiceRepository.save.mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
      serviceId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.serviceId).toBe(serviceId);
      expect(result.value.disconnected).toBe(true);
    }
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'ServiceDisconnected',
        userId,
        serviceId,
        serviceType: 'strava',
      }),
    );
  });

  it('should fail if service is not found', async () => {
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const serviceId = 'service-456';

    mockServiceRepository.findById.mockResolvedValue(
      Result.fail(new Error('Service not found')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      serviceId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Service not found');
    }
  });

  it('should fail if user is not authorized', async () => {
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const otherUserId = 'user-789';
    const serviceId = 'service-456';

    const mockService: ConnectedService = {
      id: serviceId,
      userId: otherUserId, // Different user
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
      userId,
      serviceId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Not authorized');
    }
  });
});
