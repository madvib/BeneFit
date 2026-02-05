import type { GetCoachHistoryResponse } from './use-coach';

export type CoachMessage = NonNullable<GetCoachHistoryResponse['messages'][number]>;
export type CoachCheckIn = GetCoachHistoryResponse['pendingCheckIns'][number];
export type CoachStats = GetCoachHistoryResponse['stats'];
