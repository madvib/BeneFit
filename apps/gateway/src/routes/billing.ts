import { Hono } from 'hono';
import Stripe from 'stripe';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { user } from '../lib/better-auth/schema.js';

function getStripe(env: Env): Stripe {
  const key = (env as unknown as Record<string, string>).STRIPE_SECRET_KEY;
  return new Stripe(key);
}

function getEnvVar(env: Env, key: string): string {
  return (env as unknown as Record<string, string>)[key] || '';
}

/**
 * Billing routes (authenticated, mounted under /api/billing)
 */
import type { GatewayEnv } from '../lib/types.js';

export const billingRoutes = new Hono<GatewayEnv>()
  /**
   * GET /api/billing/status
   * Returns the user's current subscription status
   */
  .get('/status', async (c) => {
    const authUser = c.get('user');
    const stripe = getStripe(c.env);
    const db = drizzle(c.env.DB_USER_AUTH);

    const [dbUser] = await db
      .select({ stripeCustomerId: user.stripeCustomerId })
      .from(user)
      .where(eq(user.id, authUser.id))
      .limit(1);

    if (!dbUser?.stripeCustomerId) {
      return c.json({
        plan: 'free' as const,
        status: 'active' as const,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      });
    }

    // Fetch active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: dbUser.stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    const sub = subscriptions.data[0];
    if (!sub) {
      return c.json({
        plan: 'free' as const,
        status: 'active' as const,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      });
    }

    // In Stripe Dahlia API, current_period_end is on subscription items
    const item = sub.items.data[0];
    const periodEnd = item?.current_period_end
      ? new Date(item.current_period_end * 1000).toISOString()
      : null;

    return c.json({
      plan: 'pro' as const,
      status: sub.status,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    });
  })

  /**
   * POST /api/billing/checkout
   * Creates a Stripe Checkout Session for the Pro plan
   */
  .post('/checkout', async (c) => {
    const authUser = c.get('user');
    const stripe = getStripe(c.env);
    const db = drizzle(c.env.DB_USER_AUTH);
    const appUrl = getEnvVar(c.env, 'APP_URL') || 'http://localhost:3000';

    // Get or create Stripe customer
    const [dbUser] = await db
      .select({ stripeCustomerId: user.stripeCustomerId })
      .from(user)
      .where(eq(user.id, authUser.id))
      .limit(1);

    let customerId = dbUser?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: authUser.email,
        metadata: { userId: authUser.id },
      });
      customerId = customer.id;
      await db
        .update(user)
        .set({ stripeCustomerId: customerId })
        .where(eq(user.id, authUser.id));
    }

    const priceId = getEnvVar(c.env, 'STRIPE_PRO_PRICE_ID');
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/{user}/billing?success=true`,
      cancel_url: `${appUrl}/{user}/billing?canceled=true`,
    });

    return c.json({ url: session.url });
  })

  /**
   * POST /api/billing/portal
   * Creates a Stripe Customer Portal session for managing subscription
   */
  .post('/portal', async (c) => {
    const authUser = c.get('user');
    const stripe = getStripe(c.env);
    const db = drizzle(c.env.DB_USER_AUTH);
    const appUrl = getEnvVar(c.env, 'APP_URL') || 'http://localhost:3000';

    const [dbUser] = await db
      .select({ stripeCustomerId: user.stripeCustomerId })
      .from(user)
      .where(eq(user.id, authUser.id))
      .limit(1);

    if (!dbUser?.stripeCustomerId) {
      return c.json({ error: 'No billing account found' }, 400);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${appUrl}/{user}/billing`,
    });

    return c.json({ url: session.url });
  });

/**
 * Stripe webhook handler (unauthenticated, mounted under /webhooks/stripe)
 */
export const stripeWebhookRoute = new Hono<{ Bindings: Env }>().post('/', async (c) => {
  const stripe = getStripe(c.env);
  const signature = c.req.header('stripe-signature');

  if (!signature) {
    return c.json({ error: 'Missing signature' }, 400);
  }

  const body = await c.req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      getEnvVar(c.env, 'STRIPE_WEBHOOK_SECRET'),
    );
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return c.json({ error: 'Invalid signature' }, 400);
  }

  const db = drizzle(c.env.DB_USER_AUTH);

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer.id;

      await db
        .update(user)
        .set({
          subscriptionStatus: subscription.status,
          subscriptionPlan:
            subscription.status === 'active' || subscription.status === 'trialing'
              ? 'pro'
              : 'free',
        })
        .where(eq(user.stripeCustomerId, customerId));

      console.log(`Subscription ${event.type} for customer ${customerId}: ${subscription.status}`);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer.id;

      await db
        .update(user)
        .set({
          subscriptionStatus: 'canceled',
          subscriptionPlan: 'free',
        })
        .where(eq(user.stripeCustomerId, customerId));

      console.log(`Subscription canceled for customer ${customerId}`);
      break;
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  return c.json({ received: true });
});

export type BillingRoutes = typeof billingRoutes;
