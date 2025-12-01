import { describe, it, beforeEach, vi, expect, type Mock } from 'vitest';
import { Result, EventBus } from '@bene/domain-shared';
import { ConnectServiceUseCase } from './connect-service.js';
import { IntegrationClient } from '../../services/integration-client.js';


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

describe('ConnectServiceUseCase', () => {
  let useCase: ConnectServiceUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new ConnectServiceUseCase(
      mockServiceRepository,
      mockIntegrationClients,
      mockEventBus,
    );
  });

  it('should successfully connect a service', async () => {
    // Arrange
    const userId = 'user-123';
    const serviceType = 'strava';
    const authorizationCode = 'auth-code-456';
    const redirectUri = 'https://example.com/callback';

    const mockTokens = {
      accessToken: 'access-token-789',
      refreshToken: 'refresh-token-101',
      expiresAt: new Date(Date.now() + 3600000),
      scopes: ['read', 'write'],
      permissions: { readWorkouts: true, writeWorkouts: true, readHeartRate: true, readSleep: true, readNutrition: true, readBodyMetrics: true },
    };

    const mockProfile = {
      id: 'external-123',
      username: 'john_doe',
      profileUrl: 'https://strava.com/athlete/123',
      units: 'metric' as const,
    };



    mockIntegrationClient.exchangeAuthCode.mockResolvedValue(Result.ok(mockTokens));
    mockIntegrationClient.getUserProfile.mockResolvedValue(Result.ok(mockProfile));
    mockServiceRepository.save.mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
      serviceType,
      authorizationCode,
      redirectUri,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.serviceId).toBeDefined();
      expect(result.value.serviceType).toBe(serviceType);
      expect(result.value.connected).toBe(true);
    }
    expect(mockIntegrationClient.exchangeAuthCode).toHaveBeenCalledWith(
      authorizationCode,
      redirectUri,
    );
    expect(mockIntegrationClient.getUserProfile).toHaveBeenCalledWith(
      'access-token-789',
    );
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ServiceConnected',
        userId,
        serviceType,
      }),
    );
  });

  it('should fail if service type is not supported', async () => {
    // Arrange
    const userId = 'user-123';
    const serviceType = 'unsupported-service';
    const authorizationCode = 'auth-code-456';
    const redirectUri = 'https://example.com/callback';

    // Act
    const result = await useCase.execute({
      userId,
      serviceType,
      authorizationCode,
      redirectUri,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toContain('Unsupported service type');
    }
  });

  it('should fail if OAuth exchange fails', async () => {
    // Arrange
    const userId = 'user-123';
    const serviceType = 'strava';
    const authorizationCode = 'auth-code-456';
    const redirectUri = 'https://example.com/callback';

    mockIntegrationClient.exchangeAuthCode.mockResolvedValue(
      Result.fail(new Error('Invalid code')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      serviceType,
      authorizationCode,
      redirectUri,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toContain('OAuth exchange failed');
    }
  });

  it('should fail if getting user profile fails', async () => {
    // Arrange
    const userId = 'user-123';
    const serviceType = 'strava';
    const authorizationCode = 'auth-code-456';
    const redirectUri = 'https://example.com/callback';

    const mockTokens = {
      accessToken: 'access-token-789',
      refreshToken: 'refresh-token-101',
      expiresAt: new Date(Date.now() + 3600000),
      scopes: ['read', 'write'],
      permissions: { readWorkouts: true, writeWorkouts: true, readHeartRate: true, readSleep: true, readNutrition: true, readBodyMetrics: true },
    };

    mockIntegrationClient.exchangeAuthCode.mockResolvedValue(Result.ok(mockTokens));
    mockIntegrationClient.getUserProfile.mockResolvedValue(
      Result.fail(new Error('Profile request failed')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      serviceType,
      authorizationCode,
      redirectUri,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toContain('Failed to get user profile');
    }
  });
});
