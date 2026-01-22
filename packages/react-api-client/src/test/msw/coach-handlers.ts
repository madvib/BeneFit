import { http, HttpResponse, delay } from 'msw';
import {
  buildGetCoachHistoryResponse,
  buildSendMessageToCoachResponse,
  buildGenerateWeeklySummaryResponse,
  buildDismissCheckInResponse,
  buildRespondToCheckInResponse,
  buildTriggerProactiveCheckInResponseRaw,
} from '../../fixtures/coach.js';
import { toHttpResponse } from './utils.js';

/**
 * Default coach MSW handlers
 */
export const coachHandlers = [
  http.get('http://*/api/coach/history', async () => {
    await delay(100);
    const data = buildGetCoachHistoryResponse(undefined, { seed: 100 });
    return toHttpResponse(data);
  }),

  http.post('http://*/api/coach/message', async ({ request }) => {
    await delay(300);
    const body = await request.json() as { message: string };
    const data = buildSendMessageToCoachResponse({
      coachResponse: `I understand you said: "${ body.message }". Let me help with that.`,
      conversationId: crypto.randomUUID(),
    });
    return toHttpResponse(data);
  }),

  http.post('http://*/api/coach/check-in/trigger', async () => {
    await delay(200);
    const result = buildTriggerProactiveCheckInResponseRaw({}, { temperature: 0.1 });
    return toHttpResponse(result);
  }),

  http.post('http://*/api/coach/check-in/respond', async () => {
    await delay(250);
    const data = buildRespondToCheckInResponse();
    return toHttpResponse(data);
  }),

  http.post('http://*/api/coach/check-in/dismiss', async () => {
    await delay(150);
    const data = buildDismissCheckInResponse();
    return toHttpResponse(data);
  }),

  http.post('http://*/api/coach/summary', async () => {
    await delay(500);
    const data = buildGenerateWeeklySummaryResponse();
    return toHttpResponse(data);
  }),
];

/**
 * Scenario-specific handlers for testing edge cases
 */
export const coachScenarios = {
  emptyHistory: [
    http.get('http://*/api/coach/history', () => {
      return HttpResponse.json({
        messages: [],
        pendingCheckIns: [],
        stats: { totalMessages: 0, totalCheckIns: 0, actionsApplied: 0 },
      });
    }),
  ],

  withPendingCheckIn: [
    http.get('http://*/api/coach/history', () => {
      const data = buildGetCoachHistoryResponse({
        pendingCheckIns: [
          {
            id: 'check-in-pending',
            question: 'How are you feeling about your training this week?',
            triggeredBy: 'low_adherence',
            status: 'pending',
            type: 'proactive',
            createdAt: new Date().toISOString(),
          },
        ],
      });
      return HttpResponse.json(data);
    }),
  ],

  withMessages: [
    http.get('http://*/api/coach/history', () => {
      const data = buildGetCoachHistoryResponse(undefined, { seed: 300 });
      return HttpResponse.json(data);
    }),
  ],

  networkError: [
    http.get('http://*/api/coach/history', () => {
      return HttpResponse.error();
    }),
  ],

  serverError: [
    http.get('http://*/api/coach/history', () => {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }),
  ],

  slowResponse: [
    http.get('http://*/api/coach/history', async () => {
      await delay(3000);
      return HttpResponse.json(buildGetCoachHistoryResponse());
    }),
  ],

  messageSendFails: [
    http.post('http://*/api/coach/message', () => {
      return HttpResponse.json(
        { error: 'Failed to send message' },
        { status: 400 }
      );
    }),
  ],
};
