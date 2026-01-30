import { createContext, useContext, useState, useEffect, useRef } from 'react';

export type ChatUIContextType = {
  leftOpen: boolean;
  rightOpen: boolean;
  mobileSidebarOpen: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
  toggleMobileSidebar: () => void;
};
const ChatUIContext = createContext<ChatUIContextType>({
  leftOpen: true,
  rightOpen: true,
  mobileSidebarOpen: false,
  toggleLeft: () => {},
  toggleRight: () => {},
  toggleMobileSidebar: () => {},
});

// Custom hook that uses the session context
export const useChatUI = () => {
  const context = useContext(ChatUIContext);
  if (!context) {
    throw new Error('useChatUI must be used within a ChatUIContextProvider');
  }
  return context;
};

export function ChatUIProvider({ children }: { children: React.ReactNode }) {
  // Initialize based on screen size to avoid flash/wrong state
  const [leftOpen, setLeftOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [rightOpen, setRightOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const prevWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isDesktop = width >= 1024;
      const wasDesktop = prevWidthRef.current >= 1024;
      const isTablet = width >= 768;
      const wasTablet = prevWidthRef.current >= 768;

      // Left Sidebar: Auto-open when entering tablet range, auto-close when leaving
      if (isTablet && !wasTablet && !leftOpen) {
        setLeftOpen(true);
      } else if (!isTablet && wasTablet && leftOpen) {
        setLeftOpen(false);
      }

      // Right Sidebar: Auto-open when entering desktop range, auto-close when leaving
      if (isDesktop && !wasDesktop && !rightOpen) {
        setRightOpen(true);
      } else if (!isDesktop && wasDesktop && rightOpen) {
        setRightOpen(false);
      }

      prevWidthRef.current = width;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [leftOpen, rightOpen]);

  const toggleLeft = () => setLeftOpen(!leftOpen);
  const toggleRight = () => setRightOpen(!rightOpen);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  return (
    <ChatUIContext.Provider
      value={{
        leftOpen,
        rightOpen,
        mobileSidebarOpen,

        toggleLeft,
        toggleRight,
        toggleMobileSidebar,
      }}
    >
      {children}
    </ChatUIContext.Provider>
  );
}
