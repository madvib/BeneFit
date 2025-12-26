import { useEffect, useState, useCallback } from 'react';
import { createWebSocketClient, BenefitWebSocketClient } from '../websocket';

// Helper to get token (duplicated from client.ts, maybe shared lib?)
const getToken = (): string => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return localStorage.getItem('token') || '';
  }
  return '';
};

export function useWebSocket(userId: string) {
  const [client, setClient] = useState<BenefitWebSocketClient | null>(null);
  const [connected, setConnected] = useState(false);
  const token = getToken();

  useEffect(() => {
    if (!userId || !token) return;

    // Create factory instance
    const factory = createWebSocketClient(token);
    const ws = factory(userId);

    ws.connect(); // Wrapper method (might be no-op if PartySocket auto-connects)
    setConnected(true); // Optimistic or add onOpen listener to wrapper?
    setClient(ws);

    return () => {
      ws.disconnect();
      setConnected(false);
    };
  }, [userId, token]);

  const send = useCallback(
    (type: string, payload?: unknown) => {
      client?.send(type, payload);
    },
    [client],
  );

  const subscribe = useCallback(
    (messageType: string, callback: (data: unknown) => void) => {
      return client?.on(messageType, callback);
    },
    [client],
  );

  return { connected, send, subscribe };
}

// Specific hook for workout progress
export function useWorkoutProgress(userId: string) {
  const { connected, send, subscribe } = useWebSocket(userId);
  const [progress, setProgress] = useState<unknown>(null);

  useEffect(() => {
    if (!connected) return;

    const unsubscribe = subscribe?.('workout.progress', (data) => {
      setProgress(data && typeof data === 'object' && 'data' in data ? (data as {data: unknown}).data : null);
    });

    return unsubscribe;
  }, [connected, subscribe]);

  const updateProgress = useCallback(
    (payload: unknown) => {
      send('workout.progress', payload);
    },
    [send],
  );

  return { progress, updateProgress, connected };
}

// Streaming chat hook
export function useStreamingChat(userId: string) {
  const { connected, send, subscribe } = useWebSocket(userId);
  const [chunks, setChunks] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Keep chunks in ref to avoid dependency cycles if needed, but state is fine for UI

  useEffect(() => {
    if (!connected) return;

    const unsubscribeChunk = subscribe?.('chat.chunk', (data) => {
      if (data && typeof data === 'object' && 'chunk' in data) {
        setChunks((prev) => [...prev, (data as {chunk: string}).chunk]);
      }
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
