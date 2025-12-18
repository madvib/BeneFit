client example with hono RPC

```typescript
// packages/api-client/src/client.ts
import { hc } from 'hono/client';
import type { WorkoutsRoute } from '@benefit/gateway';

const client = hc<WorkoutsRoute>('/api', {
  headers: () => ({
    Authorization: `Bearer ${getToken()}`,
  }),
});

// Fully typed!
const result = await client.workouts.start.$post({
  json: {
    workoutId: '123',
    planId: '456',
  },
});

const data = await result.json(); // Type: WorkoutSession
```

React Query example with hono client

```typescript
// packages/api-client/src/hooks/use-workouts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

export function useTodaysWorkout() {
  return useQuery({
    queryKey: ['workout', 'today'],
    queryFn: async () => {
      const response = await apiClient.workouts.today.$get();
      return await response.json();
    },
  });
}

export function useStartWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { workoutId: string; planId?: string }) => {
      const response = await apiClient.workouts.start.$post({ json: input });
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate today's workout
      queryClient.invalidateQueries({ queryKey: ['workout', 'today'] });
    },
  });
}

export function useCompleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { sessionId: string; performance: any }) => {
      const response = await apiClient.workouts[':sessionId'].complete.$post({
        param: { sessionId: input.sessionId },
        json: { performance: input.performance },
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout'] });
      queryClient.invalidateQueries({ queryKey: ['workouts', 'history'] });
    },
  });
}
```

## 3. Package Structure: API Client

```
packages/api-client/
├── src/
│   ├── client.ts              # Hono RPC client
│   ├── websocket.ts           # Agent client wrapper
│   ├── hooks/                 # React Query hooks
│   │   ├── use-workouts.ts
│   │   ├── use-coaching.ts
│   │   ├── use-planning.ts
│   │   └── use-websocket.ts
│   └── types.ts               # Re-export types from gateway
├── package.json
└── tsconfig.json
```

```typescript
// packages/api-client/src/websocket.ts
import { AgentClient } from '@cloudflare/agent';

interface WebSocketMessage {
  type: string;
  payload?: any;
}

export class BenefitWebSocketClient {
  private client: AgentClient;
  private listeners = new Map<string, Set<(data: any) => void>>();

  constructor(url: string, token: string) {
    this.client = new AgentClient({
      url: `${url}?token=${token}`,
      onMessage: (message) => {
        this.handleMessage(message);
      },
    });
  }

  connect() {
    return this.client.connect();
  }

  disconnect() {
    return this.client.disconnect();
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
    const data = typeof message === 'string' ? JSON.parse(message) : message;

    // Notify listeners for this message type
    const listeners = this.listeners.get(data.type);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }

    // Also notify wildcard listeners
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach((callback) => callback(data));
    }
  }
}

// Factory function
export function createWebSocketClient(token: string) {
  return new BenefitWebSocketClient(
    process.env.NEXT_PUBLIC_WS_URL || 'wss://api.yourdomain.com/api/ws',
    token,
  );
}
```

```typescript
// packages/api-client/src/hooks/use-websocket.ts
import { useEffect, useState, useCallback } from 'react';
import { createWebSocketClient } from '../websocket';

export function useWebSocket(token: string) {
  const [client, setClient] = useState<ReturnType<typeof createWebSocketClient> | null>(
    null,
  );
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = createWebSocketClient(token);
    ws.connect().then(() => setConnected(true));
    setClient(ws);

    return () => {
      ws.disconnect();
    };
  }, [token]);

  const send = useCallback(
    (type: string, payload?: any) => {
      client?.send(type, payload);
    },
    [client],
  );

  const subscribe = useCallback(
    (messageType: string, callback: (data: any) => void) => {
      return client?.on(messageType, callback);
    },
    [client],
  );

  return { connected, send, subscribe };
}

// Specific hook for workout progress
export function useWorkoutProgress() {
  const { connected, send, subscribe } = useWebSocket(getToken());
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (!connected) return;

    const unsubscribe = subscribe?.('workout.progress', (data) => {
      setProgress(data.data);
    });

    return unsubscribe;
  }, [connected, subscribe]);

  const updateProgress = useCallback(
    (payload: any) => {
      send('workout.progress', payload);
    },
    [send],
  );

  return { progress, updateProgress, connected };
}

// Streaming chat hook
export function useStreamingChat() {
  const { connected, send, subscribe } = useWebSocket(getToken());
  const [chunks, setChunks] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!connected) return;

    const unsubscribeChunk = subscribe?.('chat.chunk', (data) => {
      setChunks((prev) => [...prev, data.chunk]);
    });

    const unsubscribeComplete = subscribe?.('chat.complete', () => {
      setIsStreaming(false);
    });

    return () => {
      unsubscribeChunk?.();
      unsubscribeComplete?.();
    };
  }, [connected, subscribe]);

  const sendMessage = useCallback(
    (message: string) => {
      setChunks([]);
      setIsStreaming(true);
      send('chat.stream', { message });
    },
    [send],
  );

  return {
    message: chunks.join(''),
    chunks,
    isStreaming,
    sendMessage,
    connected,
  };
}
```
