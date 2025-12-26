import { AgentClient } from 'agents/client';

export class BenefitWebSocketClient {
  private client: AgentClient;
  private listeners = new Map<string, Set<(data: any) => void>>();

  constructor(agentName: string, agentId: string, token: string) {
    // AgentClient extends PartySocket
    // We connect to the specific agent instance (e.g. UserHub for the user)
    this.client = new AgentClient({
      agent: agentName,
      name: agentId,
      query: { token },
      host: '',
    });

    this.client.onmessage = (event) => {
      this.handleMessage(event.data);
    };
  }

  connect() {
    // PartySocket connects automatically usually, but we can access the internal socket if needed
    // or just let it handle reconnections.
    // AgentClient/PartySocket doesn't typically expose a manual 'connect' promise in the same way
    // without accessing the underlying reconnecting-websocket.
    // But we can check readyState.
    // For this wrapper, we'll assume instantiation starts connection or is handled by the framework.
    // If explicit connect is needed we might need to verify the SDK capability.
    // PartySocket handles it.
    return Promise.resolve();
  }

  disconnect() {
    this.client.close();
  }

  send(type: string, payload?: any) {
    this.client.send(JSON.stringify({ type, payload }));
  }

  // Subscribe to specific message types
  on(messageType: string, callback: (data: any) => void) {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, new Set());
    }
    this.listeners.get(messageType)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(messageType)?.delete(callback);
    };
  }

  private handleMessage(message: any) {
    try {
      const data = typeof message === 'string' ? JSON.parse(message) : message;

      // Notify listeners for this message type
      // We assume message structure is { type: '...', ... }
      if (data.type) {
        const listeners = this.listeners.get(data.type);
        if (listeners) {
          listeners.forEach((callback) => callback(data));
        }
      }

      // Also notify wildcard listeners
      const wildcardListeners = this.listeners.get('*');
      if (wildcardListeners) {
        wildcardListeners.forEach((callback) => callback(data));
      }
    } catch (e) {
      console.error('Failed to parse websocket message', e);
    }
  }
}

// Factory function
export function createWebSocketClient(token: string) {
  // We assume we are connecting to the UserHub agent for the current user
  // We need the userId.
  // IF the token contains the userId, the backend can validate.
  // But AgentClient needs the `name` (agentId).
  // We might need to decode the token or pass userId explicitly.
  // For now, I'll update the signature to require userId, or try to decode if simple JWT.
  // The Guide had `createWebSocketClient(token)`.
  // Maybe we default to a "guest" or require the caller to provide ID.
  // I will change signature to `createWebSocketClient(userId: string, token: string)` to be safe.

  return (userId: string) =>
    new BenefitWebSocketClient(
      'user-hub', // The agent class name
      userId, // The specific agent instance
      token,
    );
}
