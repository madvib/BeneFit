import { Sparkles } from 'lucide-react';
import { typography } from '@/lib/components';

export const WeeklySynthesisButton = ({
  onGenerateSummary,
  isGeneratingSummary,
}: {
  onGenerateSummary?: () => void;
  isGeneratingSummary?: boolean;
}) => (
  <button
    disabled={isGeneratingSummary}
    onClick={onGenerateSummary}
    className="group bg-card/50 border-border/50 hover:border-primary/40 relative rounded-2xl border p-4 text-left transition-all duration-300 hover:shadow-xl disabled:opacity-50"
  >
    <div className="flex items-start gap-4">
      <div className="bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-xl p-2.5 transition-all duration-300">
        <Sparkles size={16} />
      </div>
      <div>
        <p
          className={`${typography.small} group-hover:text-primary text-sm font-black transition-colors`}
        >
          Weekly Synthesis
        </p>
        <p
          className={`${typography.muted} mt-1 text-[10px] leading-tight font-medium opacity-70`}
        >
          Full performance audit via AI.
        </p>
      </div>
    </div>
  </button>
);
