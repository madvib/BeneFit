'use client';

import { Button } from '@/components';

interface SaveSettingsButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function SaveSettingsButton({ onClick, disabled = false }: SaveSettingsButtonProps) {
  return (
    <div className="flex justify-end">
      <Button
        variant="default"
        onClick={onClick}
        disabled={disabled}
      >
        Save Settings
      </Button>
    </div>
  );
}