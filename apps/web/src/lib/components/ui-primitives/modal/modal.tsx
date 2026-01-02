'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from '@/lib/providers/ui-context';
import { useEffect } from 'react';

interface ModalProperties {
  children: ReactNode;
  onClose?: () => void;
}

export function Modal({ children, onClose }: ModalProperties) {
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
        className={`fixed inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300`}
        onClick={handleClose}
      >
        <div onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
          <div className="bg-background relative z-50 w-full max-w-md rounded-lg shadow-xl">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
