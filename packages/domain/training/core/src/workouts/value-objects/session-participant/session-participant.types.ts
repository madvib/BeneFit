export type ParticipantRole = 'owner' | 'participant' | 'spectator';
export type ParticipantStatus = 'active' | 'paused' | 'completed' | 'left';

interface SessionParticipantData {
  userId: string;
  userName: string;
  avatar?: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  joinedAt: Date;
  leftAt?: Date;
  currentActivity?: string; // What activity they're on
  completedActivities: number;
}

export type SessionParticipant = Readonly<SessionParticipantData>;
