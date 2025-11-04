'use client';

interface SaveChangesButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function SaveChangesButton({ onClick, disabled = false }: SaveChangesButtonProps) {
  return (
    <div className="flex justify-end">
      <button 
        className="btn btn-primary" 
        onClick={onClick}
        disabled={disabled}
      >
        Save Changes
      </button>
    </div>
  );
}