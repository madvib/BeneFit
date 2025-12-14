// apps/actors/user-agent/src/adapters/queue-service.adapter.ts
import type { EventBus } from '@bene/shared-domain';

export class EventBusAdapter implements EventBus {
  constructor(private queueService: Fetcher) {}
  subscribe(
    eventType: string,
    handler: (event: Record<string, unknown>) => Promise<void>,
  ): void {
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
