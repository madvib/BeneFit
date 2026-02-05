import { describe, it, beforeEach, vi, expect, type Mock } from 'vitest';
import { Result, EventBus } from '@bene/shared';

import { createConnectedServiceFixture } from '@/fixtures.js';

import { DisconnectServiceUseCase } from '../disconnect-service.js';

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

const SERVICE_TYPE = 'strava';

describe('DisconnectServiceUseCase', () => {
  let useCase: DisconnectServiceUseCase;
  const TEST_USER_ID = crypto.randomUUID();
  const TEST_SERVICE_ID = crypto.randomUUID();

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new DisconnectServiceUseCase(mockServiceRepository, mockEventBus);
  });

  it('should successfully disconnect a service', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const serviceId = TEST_SERVICE_ID;

    const mockService = createConnectedServiceFixture({
      id: serviceId,
      userId,
      serviceType: SERVICE_TYPE,
    });

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
      expect(result.value.id).toBe(serviceId);
      expect(result.value.isActive).toBe(false);
    }
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'ServiceDisconnected',
        userId,
        serviceId,
        serviceType: SERVICE_TYPE,
      }),
    );
  });

  it('should fail if service is not found', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const serviceId = TEST_SERVICE_ID;

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
    const userId = TEST_USER_ID;
    const otherUserId = crypto.randomUUID();
    const serviceId = TEST_SERVICE_ID;

    const mockService = createConnectedServiceFixture({
      id: serviceId,
      userId: otherUserId,
      serviceType: SERVICE_TYPE,
    });

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
