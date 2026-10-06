/**
 * TOGOSERVE AI CORE - AI EVENT BUS
 */

export type EventHandler<T = any> = (payload: T) => void | Promise<void>;

export class AIEventBus {
  private static instance: AIEventBus;
  private listeners = new Map<string, Set<EventHandler>>();
  private eventHistory: { eventName: string; payload: any; timestamp: string }[] = [];

  private constructor() {}

  public static getInstance(): AIEventBus {
    if (!AIEventBus.instance) {
      AIEventBus.instance = new AIEventBus();
    }
    return AIEventBus.instance;
  }

  public on<T = any>(eventName: string, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(handler);
    return () => this.off(eventName, handler);
  }

  public off(eventName: string, handler: EventHandler): void {
    this.listeners.get(eventName)?.delete(handler);
  }

  public emit<T = any>(eventName: string, payload: T): void {
    this.eventHistory.push({
      eventName,
      payload,
      timestamp: new Date().toISOString(),
    });
    if (this.eventHistory.length > 500) {
      this.eventHistory.shift();
    }

    const handlers = this.listeners.get(eventName);
    if (handlers) {
      for (const h of handlers) {
        try {
          h(payload);
        } catch (err) {
          console.error(`[AIEventBus] Error in handler for ${eventName}:`, err);
        }
      }
    }
  }

  public getHistory(): { eventName: string; payload: any; timestamp: string }[] {
    return [...this.eventHistory];
  }

  public clear(): void {
    this.listeners.clear();
    this.eventHistory = [];
  }
}
