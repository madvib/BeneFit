import type { DomainEvent, EventBus } from '@bene/shared-domain';
import { env } from 'cloudflare:workers';

export class EventBusAdapter implements EventBus {
  constructor(private queueService: typeof env.EVENT_BUS) {}
  subscribe(_eventType: string, _handler: (event: DomainEvent) => Promise<void>): void {
    throw new Error('Method not implemented.');
  }

  async publish(event: DomainEvent): Promise<void> {
    // Call Queue Service via RPC
    await this.queueService.publish({ event });
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    await this.queueService.publishBatch({ events });
  }
}
