import { describe, it, expect } from 'vitest';
import { UserPreferencesSchema, toUserPreferencesSchema } from '../user-preferences.presentation.js';
import { createDefaultPreferences } from '../user-preferences.factory.js';

describe('UserPreferences Presentation', () => {
  it('should map valid preferences to presentation DTO', () => {
    const prefs = createDefaultPreferences();

    const presentation = toUserPreferencesSchema(prefs);
    const result = UserPreferencesSchema.safeParse(presentation);

    expect(result.success).toBe(true);
    expect(presentation.theme).toBe('auto');
    expect(presentation.notifications.workoutReminders).toBe(true);
  });
});
