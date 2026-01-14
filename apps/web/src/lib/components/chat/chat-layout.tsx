interface ChatLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export function ChatLayout({ children, className, sidebar, rightPanel }: Readonly<ChatLayoutProps>) {
  return (
    <div className={`relative flex flex-1 h-full overflow-hidden bg-background ${className || ''}`}>
      {sidebar}
      <div className="flex flex-1 flex-col min-w-0 relative h-full">
         {children}
      </div>
      {rightPanel}
    </div>
  );
}
