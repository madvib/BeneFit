'use client';

interface SaveSettingsButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function SaveSettingsButton({ onClick, disabled = false }: SaveSettingsButtonProps) {
  return (
    <div className="flex justify-end">
      <button 
        className="btn btn-primary" 
        onClick={onClick}
        disabled={disabled}
      >
        Save Settings
      </button>
    </div>
  );
}