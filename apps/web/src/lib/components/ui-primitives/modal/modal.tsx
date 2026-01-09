'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from '@/lib/providers/ui-context';
import { useEffect } from 'react';

interface ModalProperties {
  children: ReactNode;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  containerClassName?: string;
}

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]',
};

export function Modal({ children, onClose, size = 'md', containerClassName }: ModalProperties) {
  const router = useRouter();
  const { setIsModalOpen } = useUI();

  useEffect(() => {
    setIsModalOpen(true);
    return () => setIsModalOpen(false);
  }, [setIsModalOpen]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm transition-opacity duration-300`}
        onClick={handleClose}
      >
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          // eslint-disable-next-line security/detect-object-injection
          className={`w-full ${SIZE_CLASSES[size]} ${containerClassName || ''}`}
        >
          <div className="bg-background no-scrollbar relative z-50 max-h-[90vh] w-full overflow-y-auto rounded-2xl shadow-xl">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
