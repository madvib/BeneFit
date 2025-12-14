export interface EventBus {
  publish(event: Record<string, unknown>): Promise<void>;
  subscribe(eventType: string, handler: (event: Record<string, unknown>) => Promise<void>): void;
}
