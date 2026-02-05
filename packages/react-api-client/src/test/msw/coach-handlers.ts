
import { http, HttpResponse, delay } from 'msw';
import {
  buildGetCoachHistoryResponse,
  buildSendMessageToCoachResponse,
  buildGenerateWeeklySummaryResponse,
  buildDismissCheckInResponse,
  buildRespondToCheckInResponse,
  buildTriggerProactiveCheckInResponse,
} from '../../fixtures/coach.js';
import { toHttpResponse } from './utils.js';

/**
 * Default coach MSW handlers
 */
// Update handlers to be resilient to base URL variations
export const coachHandlers = [
  http.get('*/api/coach/history', async () => {
    await delay(100);
    const data = buildGetCoachHistoryResponse({ seed: 100 });
    return toHttpResponse(data);
  }),

  http.post('*/api/coach/message', async ({ request }) => {
    await delay(300);
    const body = await request.json() as { message: string };
    const data = buildSendMessageToCoachResponse({
      overrides: {
        coachResponse: `I understand you said: "${ body.message }". Let me help with that.`,
        conversationId: crypto.randomUUID(),
      }
    });
    return toHttpResponse(data);
  }),

  http.post('*/api/coach/check-in/trigger', async () => {
    await delay(200);
    const result = buildTriggerProactiveCheckInResponse();
    return toHttpResponse(result);
  }),

  http.post('*/api/coach/check-in/respond', async () => {
    await delay(250);
    const data = buildRespondToCheckInResponse();
    return toHttpResponse(data);
  }),

  http.post('*/api/coach/check-in/dismiss', async () => {
    await delay(150);
    const data = buildDismissCheckInResponse();
    return toHttpResponse(data);
  }),

  http.post('*/api/coach/summary', async () => {
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
    http.get('*/api/coach/history', () => {
      // Return empty stats and empty lists directly
      // Or use fixture with success=false or overrides
      const data = buildGetCoachHistoryResponse({
        overrides: {
          messages: [],
          pendingCheckIns: [],
          stats: { totalMessages: 0, totalCheckIns: 0, actionsApplied: 0 }
        }
      });
      return toHttpResponse(data);
    }),
  ],

  withPendingCheckIn: [
    http.get('*/api/coach/history', () => {
      const data = buildGetCoachHistoryResponse({
        overrides: {
          pendingCheckIns: [
            {
              id: 'check-in-pending',
              question: 'How are you feeling about your training this week?',
              triggeredBy: 'low_adherence',
              status: 'pending',
              type: 'proactive',
              createdAt: new Date().toISOString(),
              actions: [],
            },
          ],
        },
      });
      return toHttpResponse(data);
    }),
  ],

  withMessages: [
    http.get('*/api/coach/history', () => {
      const data = buildGetCoachHistoryResponse({ seed: 300 });
      return toHttpResponse(data);
    }),
  ],

  networkError: [
    http.get('*/api/coach/history', () => {
      return HttpResponse.error();
    }),
  ],

  serverError: [
    http.get('*/api/coach/history', () => {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }),
  ],

  slowResponse: [
    http.get('*/api/coach/history', async () => {
      await delay(3000);
      return toHttpResponse(buildGetCoachHistoryResponse());
    }),
  ],

  messageSendFails: [
    http.post('*/api/coach/message', () => {
      return HttpResponse.json(
        { error: 'Failed to send message' },
        { status: 400 }
      );
    }),
  ],
};
