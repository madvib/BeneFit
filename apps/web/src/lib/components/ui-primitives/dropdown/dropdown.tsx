

import { typography } from '@/lib/components';
import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: (_isOpen: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownRoot');
  }
  return context;
}

interface DropdownRootProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  openOnHover?: boolean;
}

export function DropdownRoot({ children, defaultOpen = false, openOnHover = false }: DropdownRootProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);



  const handleMouseEnter = () => {
    if (!openOnHover) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!openOnHover) return;
    timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
    }, 150); // Small delay to allow moving to content
  };

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div 
        className="relative inline-block text-left relative-dropdown-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

interface DropdownTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function DropdownTrigger({ className, children, onClick, ...props }: DropdownTriggerProps) {
  const { isOpen, setIsOpen, triggerRef } = useDropdown();

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={(e) => {
        onClick?.(e);
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

interface DropdownContentProps {
  children: React.ReactNode;
  align?: 'start' | 'end' | 'center';
  className?: string;
  width?: string | number;
}

export function DropdownContent({ 
  children, 
  align = 'end', 
  className = '',
  width = 'w-48'
}: DropdownContentProps) {
  const { isOpen, setIsOpen, triggerRef } = useDropdown();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // If clicking trigger, toggle logic in trigger handles it (or we ignore it here)
      if (triggerRef.current?.contains(target)) return;
      
      // If clicking inside content, don't close (unless it's an item click, handled separately)
      if (contentRef.current?.contains(target)) return;

      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen, triggerRef]);

  // Alignment classes
  const alignClass = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  }[align];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={`absolute z-50 mt-2 ${width} origin-top-${align === 'center' ? 'center' : align} rounded-xl border border-border bg-background p-1 shadow-xl ring-1 ring-black/5 focus:outline-none ${alignClass} ${className}`}
          style={{ top: '100%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
}

export function DropdownItem({ children, className, onClick, ...props }: DropdownItemProps) {
  const { setIsOpen } = useDropdown();

  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        e.stopPropagation();
        setIsOpen(false);
      }}
      className={`text-foreground hover:bg-accent hover:text-accent-foreground group flex w-full items-center rounded-lg px-2 py-2 text-sm transition-colors ${className} ${typography.small}`}
      {...props}
    >
      {children}
    </button>
  );
}

export const Dropdown = {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
};
