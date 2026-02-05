'use client';

import { createContext, useContext } from 'react';

const MobileSidebarContext = createContext<{
  toggleMobileSidebar: () => void;
}>({
  toggleMobileSidebar: () => {},
});

export const useMobileSidebar = () => {
  const context = useContext(MobileSidebarContext);
  if (!context) {
    throw new Error('useMobileSidebar must be used within a MobileSidebarProvider');
  }
  return context;
};

export function MobileSidebarProvider({
  children,
  toggleMobileSidebar,
}: {
  children: React.ReactNode;
  toggleMobileSidebar: () => void;
}) {
  return (
    <MobileSidebarContext.Provider value={{ toggleMobileSidebar }}>
      {children}
    </MobileSidebarContext.Provider>
  );
}
