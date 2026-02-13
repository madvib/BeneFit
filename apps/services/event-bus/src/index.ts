// apps/services/queue/src/index.ts
import { WorkerEntrypoint } from 'cloudflare:workers';
import { DomainEvent } from '@bene/shared';

export default class QueueService extends WorkerEntrypoint<Env> {
  // Publish single event
  async publish(input: {
    event: DomainEvent;
    queue?: string; // Optional: specific queue, otherwise auto-route
  }): Promise<void> {
    const eventType = (input.event as DomainEvent & { eventType?: string }).eventType || input.event.constructor.name;
    const queue = this.routeEvent(input.event, input.queue);

    await queue.send({
      type: eventType,
      data: input.event,
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'queue-service',
        version: '1.0',
      },
    });
  }

  // Batch publish
  async publishBatch(input: { events: DomainEvent[] }): Promise<void> {
    // Group by queue
    const grouped = this.groupEventsByQueue(input.events);

    // Send batches to each queue
    await Promise.all(
      Object.entries(grouped).map(([queueName, events]) => {
        const queue = this.getQueue(queueName);
        return queue.sendBatch(
          events.map((e) => ({
            body: {
              type: (e as DomainEvent & { eventType?: string }).eventType || e.constructor.name,
              data: e,
              timestamp: new Date().toISOString(),
            },
          })),
        );
      }),
    );
  }

  // Scheduled publishing (for delayed events)
  async publishDelayed(_input: {
    event: DomainEvent;
    delaySeconds: number;
  }): Promise<void> {
    // Store in DO or use Durable Objects Alarms
    // Then publish after delay
  }

  // Private routing logic
  private routeEvent(event: DomainEvent, explicitQueue?: string): Queue {
    if (explicitQueue) {
      return this.getQueue(explicitQueue);
    }

    // Auto-route based on event type
    const eventType = (event as DomainEvent & { eventType?: string }).eventType || event.constructor.name;

    // Most domain events go to main queue
    if (eventType.endsWith('Event')) {
      return this.env.DOMAIN_EVENTS_QUEUE;
    }

    // Email-specific events
    if (eventType.startsWith('Email')) {
      return this.env.EMAIL_QUEUE;
    }

    // Default
    return this.env.DOMAIN_EVENTS_QUEUE;
  }

  private getQueue(name: string): Queue {
    switch (name) {
      case 'domain-events':
        return this.env.DOMAIN_EVENTS_QUEUE;
      case 'email':
        return this.env.EMAIL_QUEUE;
      case 'analytics':
        return this.env.ANALYTICS_QUEUE;
      case 'integration-sync':
        return this.env.INTEGRATION_SYNC_QUEUE;
      default:
        throw new Error(`Unknown queue: ${ name }`);
    }
  }

  private groupEventsByQueue(events: DomainEvent[]): Record<string, DomainEvent[]> {
    const grouped: Record<string, DomainEvent[]> = {};

    for (const event of events) {
      const queue = this.routeEvent(event);
      const queueName = this.getQueue(queue);

      if (!grouped[queueName]) {
        grouped[queueName] = [];
      }
      grouped[queueName].push(event);
    }

    return grouped;
  }

  /**
   * HTTP handler for health checks
   */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', service: 'event-bus', timestamp: new Date().toISOString() });
    }

    return new Response('Event Bus Service - Access via RPC', { status: 404 });
  }
}
