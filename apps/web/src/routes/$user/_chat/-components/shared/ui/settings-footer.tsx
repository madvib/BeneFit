import { Settings } from 'lucide-react';
import { Button, typography } from '@/lib/components';

export const SettingsFooter = ({ onSettingsOpen }: { onSettingsOpen: () => void }) => (
  <div className="border-border mt-auto border-t p-4">
    <Button
      onClick={onSettingsOpen}
      variant="ghost"
      className={`${typography.small} text-muted-foreground hover:text-foreground flex w-full items-center justify-start gap-3 rounded-xl px-4 py-3 transition-colors`}
    >
      <Settings size={18} />
      <span>Settings</span>
    </Button>
  </div>
);

export const FooterSettingsButton = ({ onSettingsOpen }: { onSettingsOpen: () => void }) => (
  <Button
    onClick={onSettingsOpen}
    variant="ghost"
    className={`${typography.small} text-muted-foreground hover:text-foreground flex w-full items-center justify-start gap-3 rounded-xl px-4 py-3 transition-colors`}
  >
    <Settings size={18} />
    <span>Settings</span>
  </Button>
);
