'use client';

import { ReactNode, useEffect, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUI } from '@/lib/providers/ui-context';
import { ConfirmationModal } from './confirmation-modal';
import { Button, typography } from '@/lib/components';

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  className?: string;
  containerClassName?: string;
  isRoute?: boolean;
  /** Remove padding and background styling (useful for forms with Card components) */
  unstyled?: boolean;
  onCloseConfirm?: {
    title?: ReactNode;
    message?: ReactNode;
    confirmText?: string;
    cancelText?: string;
  };
}

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]',
};

export function Modal({
  isOpen = true,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  className,
  containerClassName,
  isRoute = false,
  unstyled = false,
  onCloseConfirm,
}: Readonly<ModalProps>) {
  const router = useRouter();
  const { setIsModalOpen } = useUI();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // Internal open state for hooks
  const effectiveOpen = isRoute ? true : isOpen;

  const handleClose = useCallback(() => {
    if (onCloseConfirm) {
      setIsConfirmationOpen(true);
    } else if (onClose) {
      onClose();
    } else if (isRoute) {
      router.back();
    }
  }, [onClose, isRoute, router, onCloseConfirm]);

  const handleConfirmClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setIsConfirmationOpen(false);
  }, [onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    setIsModalOpen(effectiveOpen);
    if (effectiveOpen) {
      document.body.style.overflow = 'hidden';
    }
  }, [effectiveOpen, setIsModalOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsModalOpen(false);
      document.body.style.overflow = 'unset';
    };
  }, [setIsModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && effectiveOpen) {
        handleClose();
      }
    };
    globalThis.addEventListener('keydown', handleEscape);
    return () => globalThis.removeEventListener('keydown', handleEscape);
  }, [effectiveOpen, handleClose]);

  return (
    <AnimatePresence mode="wait">
      {effectiveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            onAnimationComplete={(definition) => {
              // Reset overflow when exit animation completes
              if (definition === 'exit') {
                document.body.style.overflow = 'unset';
              }
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`bg-background border-border relative z-50 flex h-full w-full flex-col overflow-hidden border shadow-2xl ring-1 ring-white/10 transition-all sm:h-auto sm:rounded-4xl ${SIZE_CLASSES[size]} ${containerClassName || ''}`}
          >
            {/* Header */}
            {showCloseButton && (
              <Button
                variant="ghost"
                onClick={handleClose}
                className={`text-muted-foreground hover:text-foreground hover:bg-accent/50 z-10 rounded-full p-2 transition-all ${
                  unstyled
                    ? 'absolute top-2 right-2 sm:top-3 sm:right-3'
                    : 'absolute top-4 right-4 sm:top-6 sm:right-6'
                }`}
              >
                <X size={20} />
              </Button>
            )}

            <div
              className={
                unstyled
                  ? 'max-h-[85vh] overflow-y-auto'
                  : `flex flex-col p-6 sm:p-8 ${className || ''}`
              }
            >
              {!unstyled && (title || description) && (
                <div className="mb-8 pr-8">
                  {title && <h2 className={typography.h3}>{title}</h2>}
                  {description && (
                    <div className={`${typography.muted} mt-2 text-balance`}>{description}</div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className={unstyled ? '' : 'no-scrollbar max-h-[70vh] overflow-y-auto p-1'}>
                {children}
              </div>

              {/* Footer */}
              {!unstyled && footer && (
                <div className="border-border mt-8 flex items-center justify-end gap-3 border-t pt-8">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      {onCloseConfirm && (
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          onConfirm={handleConfirmClose}
          {...onCloseConfirm}
        />
      )}
    </AnimatePresence>
  );
}
