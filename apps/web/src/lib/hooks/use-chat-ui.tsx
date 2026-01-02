'use client';

import { createContext, useContext, useState } from 'react';

export type ChatUIContextType = {
  leftOpen: boolean;
  rightOpen: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
};
const ChatUIContext = createContext<ChatUIContextType>({
  leftOpen: true,
  rightOpen: true,
  toggleLeft: () => {},
  toggleRight: () => {},
});

// Custom hook that uses the session context
export const useChatUI = () => {
  const context = useContext(ChatUIContext);
  if (!context) {
    throw new Error('useSession must be used within a ChatUIContextProvider');
  }
  return context;
};

export function ChatUIProvider({ children }: { children: React.ReactNode }) {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  const toggleLeft = () => setLeftOpen(!leftOpen);
  const toggleRight = () => setRightOpen(!rightOpen);

  return (
    <ChatUIContext.Provider
      value={{
        leftOpen,
        rightOpen,

        toggleLeft,
        toggleRight,
      }}
    >
      {children}
    </ChatUIContext.Provider>
  );
}
