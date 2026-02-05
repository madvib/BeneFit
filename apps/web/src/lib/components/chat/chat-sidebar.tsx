import { Button } from '@/lib/components';
import { X } from 'lucide-react';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function ChatSidebar({
  isOpen,
  onClose,
  children,
  header,
  footer,
  className,
}: Readonly<ChatSidebarProps>) {
  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <aside
        className={`bg-accent/30 border-muted fixed inset-y-0 left-0 z-40 flex hidden h-full w-70 transform flex-col border-r transition-transform duration-300 ease-in-out md:static md:flex md:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full md:-ml-[280px]'} ${className || ''}`}
      >
        {/* Header Area */}
        {/* onClose is always required so this area always renders if header or implicit close button is present */}
        <div className="flex items-center justify-between p-4 pb-2">
          {header}
          <Button variant="ghost" size="sm" onClick={onClose} className="ml-auto md:hidden">
            <X size={18} />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-3 py-2">{children}</div>

        {/* Footer Area */}
        {footer && <div className="border-muted mt-auto border-t p-4">{footer}</div>}
      </aside>
    </>
  );
}
