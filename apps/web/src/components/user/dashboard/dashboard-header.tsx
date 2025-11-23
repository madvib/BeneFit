import { Button } from '@/components';
import { Download, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onExport?: () => void;
  onQuickLog?: () => void;
}

export default function DashboardHeader({ 
  title, 
  subtitle, 
  onExport, 
  onQuickLog 
}: DashboardHeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" className="inline-flex items-center gap-2" onClick={onExport}>
          <Download size={16} /> Export
        </Button>
        <Button className="inline-flex items-center gap-2" onClick={onQuickLog}>
          <Plus size={16} /> Quick Log
        </Button>
      </div>
    </header>
  );
}