import { MessageSquare } from 'lucide-react';
import { typography } from '@/lib/components';

export const SystemContextSection = () => (
  <div className="bg-accent/40 border-border/50 ring-border/20 rounded-2xl border p-5 ring-1">
    <div className="mb-3 flex items-center gap-2">
      <MessageSquare size={12} className="text-primary" />
      <p className={`${typography.muted} text-[10px] font-black tracking-widest uppercase`}>
        System Context
      </p>
    </div>
    <p className={`${typography.small} text-xs leading-relaxed`}>
      Advice tailored to your{' '}
      <span className="text-primary font-medium">Elite Strength Protocol</span> plan.
    </p>
  </div>
);

export const RightPanelFooter = () => (
  <div className="mt-auto pt-6">
    <div className="from-border/50 mb-4 h-px bg-linear-to-r via-transparent to-transparent" />
    <p className={`${typography.muted} text-center text-[10px] opacity-50`}>
      Generated based on your profile & history
    </p>
  </div>
);
