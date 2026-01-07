import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { account } from '../lib/better-auth/schema.js';

/**
 * Strava webhook event payload
 * @see https://developers.strava.com/docs/webhooks/
 */
interface StravaWebhookEvent {
  object_type: 'activity' | 'athlete';
  object_id: number;
  aspect_type: 'create' | 'update' | 'delete';
  owner_id: number; // Athlete ID
  subscription_id: number;
  event_time: number; // Unix timestamp
  updates?: Record<string, unknown>;
}

export const webhookRoutes = new Hono<{ Bindings: Env }>()
  /**
   * GET /webhooks/strava
   * Handles Strava webhook subscription validation
   * Strava sends this to validate our callback URL when creating a subscription
   */
  .get('/strava', (c) => {
    const mode = c.req.query('hub.mode');
    const challenge = c.req.query('hub.challenge');
    const verifyToken = c.req.query('hub.verify_token');

    console.log('Strava webhook validation request:', { mode, verifyToken });

    // Verify the token matches our expected value
    const expectedToken = (c.env as any).STRAVA_VERIFY_TOKEN || 'STRAVA';
    if (verifyToken !== expectedToken) {
      console.error('Invalid verify token');
      return c.json({ error: 'Invalid verify token' }, 403);
    }

    if (mode !== 'subscribe') {
      console.error('Invalid mode:', mode);
      return c.json({ error: 'Invalid mode' }, 400);
    }

    if (!challenge) {
      console.error('Missing challenge');
      return c.json({ error: 'Missing challenge' }, 400);
    }

    // Echo back the challenge as required by Strava
    console.log('Webhook validation successful');
    return c.json({ 'hub.challenge': challenge });
  })

  /**
   * POST /webhooks/strava
   * Processes Strava webhook events (activity create/update/delete)
   * 
   * Webhooks only contain event metadata - the actual activity data must be fetched.
   * This handler triggers the existing SyncServiceDataUseCase to fetch updated activities.
   */
  .post('/strava', async (c) => {
    try {
      const event: StravaWebhookEvent = await c.req.json();
      console.log('Received Strava webhook event:', event);

      // Only process activity events for now
      if (event.object_type !== 'activity') {
        console.log('Ignoring non-activity event');
        return c.json({ status: 'ignored' }, 200);
      }

      // Look up the user by athlete ID in the account table
      const db = drizzle(c.env.DB_USER_AUTH);
      const accountRecord = await db
        .select()
        .from(account)
        .where(
          and(
            eq(account.accountId, String(event.owner_id)),
            eq(account.providerId, 'strava')
          )
        )
        .limit(1);

      if (accountRecord.length === 0) {
        console.warn(`No user found for athlete ID ${ event.owner_id }`);
        return c.json({ status: 'user_not_found' }, 200);
      }

      const userAccount = accountRecord[0];
      const userId = userAccount.userId;

      console.log(`Processing event for user ${ userId }`);

      // Get the UserHub instance for this user
      const userHubId = c.env.USER_HUB.idFromName(userId);
      const userHub = c.env.USER_HUB.get(userHubId);

      // Get connected services to find the Strava serviceId
      const connectedServicesResult = await userHub.integrations().getConnectedServices({ userId });

      // Find the Strava service
      const services = connectedServicesResult.isSuccess ? connectedServicesResult.value.services : [];
      const stravaService = services.find((s: { serviceType: string }) => s.serviceType === 'strava');

      if (!stravaService) {
        console.warn(`No Strava service found for user ${ userId }`);
        return c.json({ status: 'service_not_found' }, 200);
      }

      // Trigger sync using existing SyncServiceDataUseCase via sync() RPC
      console.log(`Triggering sync for service ${ stravaService.id }`);
      const syncResult = await userHub.integrations().sync({ serviceId: stravaService.id });

      if (syncResult.isSuccess) {
        console.log(`Successfully synced ${ syncResult.value.activitiesSynced } activities`);
      } else {
        console.error(`Sync failed: ${ syncResult.errorMessage }`);
      }

      // Respond quickly (within 2 seconds as required by Strava)
      return c.json({ status: 'accepted' }, 200);
    } catch (error) {
      console.error('Error processing webhook:', error);
      // Still return 200 to prevent Strava from retrying
      return c.json({ status: 'error', error: String(error) }, 200);
    }
  });

export type WebhookRoutes = typeof webhookRoutes;
