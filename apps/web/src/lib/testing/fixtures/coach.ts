import { coach } from '@bene/react-api-client';

export const mockCoachHistory: coach.GetCoachHistoryResponse = {
  messages: [
    {
      id: 'msg-1',
      role: 'coach',
      content: 'Great job on your last workout!',
      timestamp: '2026-01-06T10:00:00Z',
    },
    {
      id: 'msg-2',
      role: 'user',
      content: 'Thanks! I felt strong.',
      timestamp: '2026-01-06T10:05:00Z',
    },
  ],
  pendingCheckIns: [
    {
      id: 'check-in-1',
      question: 'How are you feeling after your recent volume increase?',
      triggeredBy: 'system',
    },
  ],
  stats: {
    totalMessages: 2,
    totalCheckIns: 10,
    actionsApplied: 5,
  },
};
