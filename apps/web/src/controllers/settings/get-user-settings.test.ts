import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCurrentUser } from '../auth/session/session';
import { settingsUseCases } from '@/providers/settings-use-cases';
import { getUserSettings, updateUserSettings } from './get-user-settings';

// Mock the dependencies
vi.mock('@/providers/settings-use-cases', () => ({
  settingsUseCases: {
    getUserSettingsUseCase: {
      execute: vi.fn(),
    },
    updateUserSettingsUseCase: {
      execute: vi.fn(),
    },
  },
}));

vi.mock('../auth/session/session', () => ({
  getCurrentUser: vi.fn(),
}));

// Shared mock data factories
const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'user@example.com',
  ...overrides,
});

const createMockUserData = (overrides = {}) => ({
  success: true,
  data: createMockUser(),
  ...overrides,
});

const createMockUserError = (message: string = 'User not authenticated') => ({
  success: false,
  error: message,
});

const createMockSettings = (overrides = {}) => ({
  notificationPreferences: {
    emailNotifications: true,
    pushNotifications: false,
    workoutReminders: true,
  },
  privacySettings: {
    profileVisibility: 'Public' as const,
    activitySharing: true,
  },
  fitnessPreferences: {
    preferredUnits: 'Metric (kg, km)' as const,
    goalFocus: 'General Fitness' as const,
  },
  userId: 'user-123',
  ...overrides,
});

const createMockUpdateInput = (overrides = {}) => ({
  notificationPreferences: {
    emailNotifications: false,
    pushNotifications: false,
    workoutReminders: false,
  },
  ...overrides,
});

const createSuccessfulResult = (value: any) =>
  ({
    isSuccess: true,
    value,
  }) as any;

const createFailedResult = (error: any) =>
  ({
    isFailure: true,
    error,
  }) as any;

describe('getUserSettings controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully retrieves user settings when user is authenticated', async () => {
    // Setup: Mock authenticated user and successful settings retrieval
    vi.mocked(getCurrentUser).mockResolvedValue(createMockUserData());

    const mockSettingsOutput = createMockSettings({
      userId: 'user-123',
    });

    vi.mocked(settingsUseCases.getUserSettingsUseCase.execute).mockResolvedValue(
      createSuccessfulResult(mockSettingsOutput),
    );

    const result = await getUserSettings();

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    if (result.data) {
      expect(result.data.notificationPreferences).toEqual(
        mockSettingsOutput.notificationPreferences,
      );
      expect(result.data.privacySettings).toEqual(mockSettingsOutput.privacySettings);
      expect(result.data.fitnessPreferences).toEqual(
        mockSettingsOutput.fitnessPreferences,
      );
    }
  });

  it('returns error when user is not authenticated', async () => {
    // Setup: Mock unauthenticated user
    vi.mocked(getCurrentUser).mockResolvedValue(
      createMockUserError('User not authenticated'),
    );

    const result = await getUserSettings();

    expect(result.success).toBe(false);
    expect(result.error).toBe('User not authenticated');
  });

  it('handles use case execution errors', async () => {
    // Setup: Mock authenticated user but failing use case
    vi.mocked(getCurrentUser).mockResolvedValue(createMockUserData());

    vi.mocked(settingsUseCases.getUserSettingsUseCase.execute).mockResolvedValue(
      createFailedResult(new Error('Use case failed')),
    );

    const result = await getUserSettings();

    expect(result.success).toBe(false);
    expect(result.error).toBe('Use case failed');
  });

  it('handles unexpected errors gracefully', async () => {
    // Setup: Mock authenticated user but throwing use case
    vi.mocked(getCurrentUser).mockResolvedValue(createMockUserData());
    vi.mocked(settingsUseCases.getUserSettingsUseCase.execute).mockRejectedValue(
      new Error('Unexpected error'),
    );

    const result = await getUserSettings();

    expect(result.success).toBe(false);
    expect(result.error).toBe('An unexpected error occurred');
  });

  it('forwards use case error messages correctly', async () => {
    // Setup: Mock authenticated user with use case error having message
    vi.mocked(getCurrentUser).mockResolvedValue(createMockUserData());

    vi.mocked(settingsUseCases.getUserSettingsUseCase.execute).mockResolvedValue(
      createFailedResult({ message: 'Specific error message' }),
    );

    const result = await getUserSettings();

    expect(result.success).toBe(false);
    expect(result.error).toBe('Specific error message');
  });

  it('includes userId in output data', async () => {
    // Setup: Mock authenticated user and settings data
    vi.mocked(getCurrentUser).mockResolvedValue(
      createMockUserData({ data: createMockUser({ id: 'user-test-id' }) }),
    );

    const mockSettingsOutput = createMockSettings({
      notificationPreferences: {
        emailNotifications: false,
        pushNotifications: true,
        workoutReminders: false,
      },
      privacySettings: {
        profileVisibility: 'Friends Only',
        activitySharing: false,
      },
      fitnessPreferences: {
        preferredUnits: 'Imperial (lbs, miles)',
        goalFocus: 'Weight Loss',
      },
      userId: 'user-test-id',
    });

    vi.mocked(settingsUseCases.getUserSettingsUseCase.execute).mockResolvedValue(
      createSuccessfulResult(mockSettingsOutput),
    );

    const result = await getUserSettings();

    expect(result.success).toBe(true);
    if (result.data) {
      expect(result.data.notificationPreferences.emailNotifications).toBe(false);
      expect(result.data.fitnessPreferences.goalFocus).toBe('Weight Loss');
    }
  });
});

describe('updateUserSettings controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully updates user settings when user is authenticated', async () => {
    // Setup: Mock authenticated user and successful update
    vi.mocked(getCurrentUser).mockResolvedValue(createMockUserData());

    const mockUpdateInput = createMockUpdateInput({
      notificationPreferences: {
        emailNotifications: false,
        pushNotifications: false,
        workoutReminders: false,
      },
    });

    vi.mocked(settingsUseCases.updateUserSettingsUseCase.execute).mockResolvedValue(
      createSuccessfulResult({
        success: true,
        message: 'Settings updated successfully',
      }),
    );

    const result = await updateUserSettings(mockUpdateInput);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Settings updated successfully');

    // Verify that use case was called with correct parameters
    expect(settingsUseCases.updateUserSettingsUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-123',
      settings: mockUpdateInput,
    });
  });

  it('returns error when user is not authenticated', async () => {
    // Setup: Mock unauthenticated user
    vi.mocked(getCurrentUser).mockResolvedValue(
      createMockUserError('User not authenticated'),
    );

    const mockUpdateInput = createMockUpdateInput({
      privacySettings: {
        profileVisibility: 'Private',
      },
    });

    const result = await updateUserSettings(mockUpdateInput);

    expect(result.success).toBe(false);
    expect(result.error).toBe('User not authenticated');
  });

  it('handles use case execution errors', async () => {
    // Setup: Mock authenticated user but failing use case
    vi.mocked(getCurrentUser).mockResolvedValue(createMockUserData());

    const mockUpdateInput = createMockUpdateInput({
      fitnessPreferences: {
        preferredUnits: 'Metric (kg, km)',
      },
    });

    vi.mocked(settingsUseCases.updateUserSettingsUseCase.execute).mockResolvedValue(
      createFailedResult(new Error('Update failed')),
    );

    const result = await updateUserSettings(mockUpdateInput);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Update failed');
  });

  it('handles partial updates correctly', async () => {
    // Setup: Mock authenticated user and partial update
    vi.mocked(getCurrentUser).mockResolvedValue(createMockUserData());

    const mockUpdateInput = createMockUpdateInput({
      notificationPreferences: {
        pushNotifications: false,
      },
      privacySettings: {
        activitySharing: true,
      },
    });

    vi.mocked(settingsUseCases.updateUserSettingsUseCase.execute).mockResolvedValue(
      createSuccessfulResult({ success: true, message: 'Updated' }),
    );

    const result = await updateUserSettings(mockUpdateInput);

    expect(result.success).toBe(true);

    // Verify that both settings types were passed to the use case
    expect(settingsUseCases.updateUserSettingsUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-123',
      settings: mockUpdateInput,
    });
  });

  it('handles unexpected errors during update', async () => {
    // Setup: Mock authenticated user but throwing use case
    vi.mocked(getCurrentUser).mockResolvedValue(createMockUserData());

    const mockUpdateInput = createMockUpdateInput({
      notificationPreferences: {
        emailNotifications: true,
      },
    });

    vi.mocked(settingsUseCases.updateUserSettingsUseCase.execute).mockRejectedValue(
      new Error('Unexpected update error'),
    );

    const result = await updateUserSettings(mockUpdateInput);

    expect(result.success).toBe(false);
    expect(result.error).toBe('An unexpected error occurred');
  });

  it('forwards use case error messages correctly during update', async () => {
    // Setup: Mock authenticated user with use case error having message
    vi.mocked(getCurrentUser).mockResolvedValue(createMockUserData());

    const mockUpdateInput = createMockUpdateInput({
      privacySettings: {
        profileVisibility: 'Private',
      },
    });

    vi.mocked(settingsUseCases.updateUserSettingsUseCase.execute).mockResolvedValue(
      createFailedResult({ message: 'Specific update error' }),
    );

    const result = await updateUserSettings(mockUpdateInput);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Specific update error');
  });
});
