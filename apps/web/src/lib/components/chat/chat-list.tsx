

import { typography } from '@/lib/components';
import { useEffect, useRef } from 'react';
import React from 'react';

interface ChatListProps {
  children: React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
  typingIndicator?: React.ReactNode;
}

export function ChatList({
  children,
  className,
  emptyState,
  typingIndicator,
}: Readonly<ChatListProps>) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottomRef = useRef(true);

  // Check if user is scrolled to bottom
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Allow a small buffer (e.g. 50px)
    isScrolledToBottomRef.current = scrollHeight - scrollTop - clientHeight <= 50;
  };

  // Scroll to bottom when children change, ONLY if previously scrolled to bottom or new content
  useEffect(() => {
    if (isScrolledToBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [children, typingIndicator]);

  const hasChildren = React.Children.count(children) > 0;

  return (
    <div 
      className={`no-scrollbar relative z-0 flex-1 overflow-y-auto scroll-smooth p-4 md:p-8 ${className || ''}`}
      ref={containerRef}
      onScroll={handleScroll}
    >
      <div className="mx-auto flex max-w-3xl flex-col min-h-full">
        {!hasChildren && emptyState ? (
           emptyState
        ) : (
          <>
            {children}
            {typingIndicator && (
               <div className="flex w-full justify-start py-4 animate-in fade-in duration-300">
                <div
                    className={`${typography.small} bg-accent/50 text-primary ring-border/50 flex max-w-[80%] items-center gap-1.5 rounded-2xl rounded-tl-none px-5 py-3.5 ring-1`}
                  >
                    <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-current"></span>
                    <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-current delay-150"></span>
                    <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-current delay-300"></span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </>
        )}
      </div>
    </div>
  );
}

// End of file
