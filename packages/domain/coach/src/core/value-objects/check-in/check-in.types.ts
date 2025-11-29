import { CoachAction } from '../coach-action/index.js';

export type CheckInType = 'proactive' | 'scheduled' | 'user_initiated';
export type CheckInTrigger =
  | 'low_adherence'
  | 'high_exertion'
  | 'injury_reported'
  | 'weekly_review'
  | 'milestone_achieved'
  | 'streak_broken'
  | 'difficulty_pattern'
  | 'enjoyment_declining';

export interface CheckInData {
  id: string;
  type: CheckInType;
  triggeredBy?: CheckInTrigger;

  // The check-in question/prompt
  question: string;
  userResponse?: string;

  // Coach's analysis and actions
  coachAnalysis?: string;
  actions: CoachAction[];

  // Status
  status: 'pending' | 'responded' | 'dismissed';

  // Timestamps
  createdAt: Date;
  respondedAt?: Date;
  dismissedAt?: Date;
}

export type CheckIn = Readonly<CheckInData>;
