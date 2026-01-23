import { describe, it, beforeEach, vi, expect, type Mock } from 'vitest';
import { randomUUID } from 'node:crypto';
import { Result, EventBus } from '@bene/shared';
import { IntegrationClient } from '@/application/ports/integration-client.js';
import { createOAuthCredentialsFixture, createServicePermissionsFixture, createServiceMetadataFixture } from '@/fixtures.js';
import { ConnectServiceUseCase } from '../connect-service.js';

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

describe('ConnectServiceUseCase', () => {
  let useCase: ConnectServiceUseCase;
  const TEST_USER_ID = randomUUID();
  const TEST_AUTH_CODE = 'test-auth-code';
  const TEST_REDIRECT_URI = 'https://example.com/callback';

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
    const userId = TEST_USER_ID;
    const serviceType = SERVICE_TYPE;
    const authorizationCode = TEST_AUTH_CODE;
    const redirectUri = TEST_REDIRECT_URI;

    const accessToken = 'test-access-token';
    const mockTokens = {
      ...createOAuthCredentialsFixture({
        accessToken,
        refreshToken: 'test-refresh-token',
        scopes: ['read', 'write'],
      }),
      permissions: createServicePermissionsFixture({
        readWorkouts: true,
        writeWorkouts: true,
        readHeartRate: true,
        readSleep: true,
        readNutrition: true,
        readBodyMetrics: true,
      }),
    };

    const mockProfileMetadata = createServiceMetadataFixture({
      externalUserId: 'test-external-id',
      externalUsername: 'test-username',
      profileUrl: 'https://example.com/profile/test-user',
      units: 'metric',
    });

    const mockProfile = {
      id: mockProfileMetadata.externalUserId,
      username: mockProfileMetadata.externalUsername,
      profileUrl: mockProfileMetadata.profileUrl,
      units: mockProfileMetadata.units,
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
      expect(result.value.id).toBeDefined();
      expect(result.value.serviceType).toBe(serviceType);
      expect(result.value.isActive).toBe(true);
    }
    expect(mockIntegrationClient.exchangeAuthCode).toHaveBeenCalledWith(
      authorizationCode,
      redirectUri,
    );
    expect(mockIntegrationClient.getUserProfile).toHaveBeenCalledWith(
      accessToken,
    );
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'ServiceConnected',
        userId,
        serviceType,
      }),
    );
  });

  it('should fail if service type is not supported', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const serviceType = 'unsupported-service' as any;
    const authorizationCode = TEST_AUTH_CODE;
    const redirectUri = TEST_REDIRECT_URI;

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
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toContain('Unsupported service type');
    }
  });

  it('should fail if OAuth exchange fails', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const serviceType = SERVICE_TYPE;
    const authorizationCode = TEST_AUTH_CODE;
    const redirectUri = TEST_REDIRECT_URI;

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
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toContain('OAuth exchange failed');
    }
  });

  it('should fail if getting user profile fails', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const serviceType = SERVICE_TYPE;
    const authorizationCode = TEST_AUTH_CODE;
    const redirectUri = TEST_REDIRECT_URI;

    const mockTokens = {
      ...createOAuthCredentialsFixture({
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        scopes: ['read', 'write'],
      }),
      permissions: createServicePermissionsFixture({
        readWorkouts: true,
        writeWorkouts: true,
        readHeartRate: true,
        readSleep: true,
        readNutrition: true,
        readBodyMetrics: true,
      }),
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
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toContain('Failed to get user profile');
    }
  });
});
