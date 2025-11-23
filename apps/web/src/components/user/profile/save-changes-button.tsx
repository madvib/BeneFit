'use client';

import { Button } from '@/components';

interface SaveChangesButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function SaveChangesButton({ onClick, disabled = false }: SaveChangesButtonProps) {
  return (
    <div className="flex justify-end">
      <Button
        variant="default"
        size="lg"
        onClick={onClick}
        disabled={disabled}
      >
        Save Profile
      </Button>
    </div>
  );
}