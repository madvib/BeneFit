import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button, IconBox, Modal, typography } from '@/lib/components';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: ReactNode;
  message?: ReactNode;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'You have unsaved changes that will be lost.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: Readonly<ConfirmationModalProps>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <IconBox
          icon={AlertTriangle}
          variant="destructive"
          size="lg"
          className="mb-6 rounded-2xl"
        />
        <h2 className={typography.h3}>{title}</h2>
        <p className={`${typography.muted} mt-2`}>{message}</p>
      </div>
      <div className="mt-8 flex justify-center gap-4">
        <Button variant="outline" onClick={onClose} className="w-full rounded-xl">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} className="w-full rounded-xl">
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
