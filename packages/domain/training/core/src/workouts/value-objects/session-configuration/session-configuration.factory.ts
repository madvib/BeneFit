import { Result } from '@bene/shared';
import { SessionConfiguration } from './session-configuration.types.js';

export function createSessionConfiguration(props: SessionConfiguration): Result<SessionConfiguration> {
  if (props.maxParticipants <= 0) {
    return Result.fail(new Error('Max participants must be positive'));
  }

  return Result.ok(props);
}

export function createDefaultSessionConfig(
  isMultiplayer: boolean,
): SessionConfiguration {
  return {
    isMultiplayer,
    isPublic: false,
    maxParticipants: isMultiplayer ? 10 : 1,
    allowSpectators: false,
    enableChat: isMultiplayer,
    enableVoiceAnnouncements: true,
    showOtherParticipantsProgress: isMultiplayer,
    autoAdvanceActivities: false,
  };
}
