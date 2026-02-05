import { X } from 'lucide-react';
import { Button, typography } from '@/lib/components';

export const SidebarHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <div className="border-border/50 flex items-center justify-between border-b p-4 pb-2">
    <h3 className={`${typography.h4} text-sm font-bold tracking-tight`}>{title}</h3>
    <Button variant="ghost" size="sm" onClick={onClose}>
      <X size={18} />
    </Button>
  </div>
);
