interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex?: number;
  className?: string;
}

export const MobileOverlay = ({
  isOpen,
  onClose,
  zIndex = 40,
  className = '',
}: MobileOverlayProps) => {
  return (
    <div
      className={`fixed inset-0 z-${zIndex} bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      } ${className}`}
      onClick={onClose}
    />
  );
};
