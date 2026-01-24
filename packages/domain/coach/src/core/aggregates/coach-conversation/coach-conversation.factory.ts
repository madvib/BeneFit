import { z } from 'zod';

import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import {
  CoachContext,
  CoachContextSchema,
  CoachMsg,
  CreateCoachContextSchema,
  CreateCoachMessageSchema
} from '../../value-objects/index.js';
import {
  CoachConversation,
  CoachConversationSchema
} from './coach-conversation.types.js';

/**
 * ============================================================================
 * COACH CONVERSATION FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. coachConversationFromPersistence() - For fixtures & DB hydration
 * 2. CreateCoachConversationSchema - Zod transform for API boundaries
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands CoachConversation */
function validateCoachConversation(data: unknown): Result<CoachConversation> {
  const parseResult = CoachConversationSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

function createDefaultCoachContext(): Result<CoachContext> {
  // Use CreateCoachContextSchema with defaults
  const result = CreateCoachContextSchema.safeParse({
    recentWorkouts: [],
    userGoals: {
      primary: 'strength',
      secondary: [],
      motivation: 'General fitness improvement',
      successCriteria: [],
    },
    userConstraints: {
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableEquipment: ['bodyweight'],
      location: 'home',
    },
    experienceLevel: 'beginner',
    trends: {
      volumeTrend: 'stable',
      adherenceTrend: 'stable',
      energyTrend: 'medium',
      exertionTrend: 'stable',
      enjoymentTrend: 'stable',
    },
    daysIntoCurrentWeek: 0,
    workoutsThisWeek: 0,
    plannedWorkoutsThisWeek: 0,
    energyLevel: 'medium',
  });

  return result.success ? Result.ok(result.data as CoachContext) : Result.fail(mapZodError(result.error));
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates CoachConversation from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function coachConversationFromPersistence(
  data: Unbrand<CoachConversation>,
): Result<CoachConversation> {
  return Result.ok(data as CoachConversation);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating CoachConversation with validation.
 */
export const CreateCoachConversationSchema = CoachConversationSchema.pick({
  userId: true,
}).extend({
  id: z.uuid().optional(),
  context: CoachContextSchema.partial().optional(),
  initialMessage: z.string().optional(),
  startedAt: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  const now = input.startedAt || new Date();

  // Context handling
  let initialContext: CoachContext;
  if (input.context) {
    const contextResult = CreateCoachContextSchema.safeParse(input.context);
    if (!contextResult.success) {
      return unwrapOrIssue(Result.fail(mapZodError(contextResult.error)), ctx);
    }
    initialContext = contextResult.data;
  } else {
    const defaultContextResult = createDefaultCoachContext();
    if (defaultContextResult.isFailure) {
      ctx.addIssue({ code: 'custom', message: `Failed to create default context: ${ defaultContextResult.error }` });
      return z.NEVER;
    }
    initialContext = defaultContextResult.value;
  }

  // Initial message handling
  let initialMessages: CoachMsg[] = [];
  let initialTotalCoachMessages = 0;

  if (input.initialMessage) {
    const messageResult = CreateCoachMessageSchema.safeParse({
      content: input.initialMessage
    });
    if (!messageResult.success) {
      return unwrapOrIssue(Result.fail(mapZodError(messageResult.error)), ctx);
    }
    initialMessages = [messageResult.data];
    initialTotalCoachMessages = 1;
  }

  const data = {
    id: input.id || crypto.randomUUID(),
    userId: input.userId,
    context: initialContext,
    messages: initialMessages,
    checkIns: [],
    totalMessages: input.initialMessage ? 1 : 0,
    totalUserMessages: 0,
    totalCoachMessages: initialTotalCoachMessages,
    totalCheckIns: 0,
    pendingCheckIns: 0,
    startedAt: now,
    lastMessageAt: now,
    lastContextUpdateAt: now,
  };

  const validationResult = validateCoachConversation(data);
  return unwrapOrIssue(validationResult, ctx);
}) satisfies z.ZodType<CoachConversation>;
