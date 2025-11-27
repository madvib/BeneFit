type CoachActionType =
  | 'adjusted_plan'
  | 'suggested_rest_day'
  | 'encouraged'
  | 'scheduled_followup'
  | 'recommended_deload'
  | 'modified_exercise'
  | 'celebrated_win';
interface CoachActionData {
  type: CoachActionType;
  details: string;
  appliedAt: Date;
  planChangeId?: string; // Reference to plan adjustment if applicable
}

export type CoachAction = Readonly<CoachActionData>;
