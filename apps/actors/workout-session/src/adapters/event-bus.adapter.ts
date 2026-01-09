import type { DomainEvent, EventBus } from '@bene/shared';
import { env } from 'cloudflare:workers';

export class EventBusAdapter implements EventBus {
  constructor(private queueService: typeof env.EVENT_BUS) { }
  subscribe(_eventType: string, _handler: (event: DomainEvent) => Promise<void>): void {
    throw new Error('Method not implemented.');
  }

  async publish(event: DomainEvent): Promise<void> {
    // Call Queue Service via RPC - use toJSON for serialization
    await this.queueService.publish({ event: event.toJSON() as any });
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    await this.queueService.publishBatch({
      events: events.map((e) => e.toJSON() as any),
    });
  }
}
