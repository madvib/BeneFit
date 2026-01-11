import {
  Sparkles,
  Apple,
  BatteryPlus,
  BicepsFlexed,
  PersonStanding,
  PanelRightClose,
  Layout,
  MessageSquare,
} from 'lucide-react';
import { Typography, Button } from '@/lib/components';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Core':
    case 'Flexibility':
      return <PersonStanding size={14} />;
    case 'Nutrition':
      return <Apple size={14} />;
    case 'Wellness':
      return <BatteryPlus size={14} />;
    case 'Workout':
      return <BicepsFlexed size={14} />;
    default:
      return <Sparkles size={14} />;
  }
};

interface RecommendationData {
  id: number | string;
  title: string;
  reason: string;
  type: string;
}

interface RightActionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: RecommendationData[];
  onGenerateSummary?: () => void;
  isGeneratingSummary?: boolean;
}

export default function RightActionPanel({
  isOpen,
  onClose,
  recommendations,
  onGenerateSummary,
  isGeneratingSummary,
}: RightActionPanelProps) {
  return (
    <aside
      className={`bg-background/80 border-border/50 hidden w-[320px] flex-col border-l backdrop-blur-xl transition-all duration-500 lg:flex ${
        isOpen
          ? 'mr-0 translate-x-0 opacity-100'
          : '-mr-[320px] w-0 translate-x-[320px] overflow-hidden border-l-0 opacity-0'
      }`}
    >
      <div className="flex h-full flex-col p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Layout size={16} />
            </div>
            <div>
              <Typography
                variant="h4"
                className="text-sm font-black tracking-tighter uppercase italic"
              >
                Analysis
              </Typography>
              <Typography
                variant="muted"
                className="text-[9px] leading-none font-black tracking-widest uppercase"
              >
                Intelligence Suite
              </Typography>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg transition-all active:scale-90"
          >
            <PanelRightClose size={16} />
          </Button>
        </div>

        <div className="no-scrollbar flex-1 space-y-8 overflow-y-auto">
          {/* Project Context / Status */}
          <div className="bg-accent/40 border-border/50 ring-border/20 rounded-2xl border p-5 ring-1">
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare size={12} className="text-primary" />
              <Typography
                variant="muted"
                className="text-[10px] font-black tracking-widest uppercase"
              >
                System Context
              </Typography>
            </div>
            <Typography variant="small" className="text-xs leading-relaxed font-bold">
              Calibrating response profile based on your current{' '}
              <span className="text-primary italic">Elite Strength Protocol</span>.
            </Typography>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <Typography
                variant="muted"
                className="text-[10px] font-black tracking-widest uppercase"
              >
                Suggested Commands
              </Typography>
              <div className="bg-border/50 h-px flex-1" />
            </div>

            <div className="grid gap-4">
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
                    <Typography
                      variant="small"
                      className="group-hover:text-primary text-sm font-black transition-colors"
                    >
                      Weekly Synthesis
                    </Typography>
                    <Typography
                      variant="muted"
                      className="mt-1 text-[10px] leading-tight font-medium opacity-70"
                    >
                      Full performance audit via AI.
                    </Typography>
                  </div>
                </div>
              </button>

              {recommendations.map((rec, idx) => (
                <button
                  key={idx}
                  className="group bg-card/50 border-border/50 hover:border-primary/40 relative rounded-2xl border p-4 text-left transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/80 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary rounded-xl p-2.5 transition-all duration-300">
                      {getCategoryIcon(rec.type)}
                    </div>
                    <div>
                      <Typography
                        variant="small"
                        className="group-hover:text-primary text-sm font-black transition-colors"
                      >
                        {rec.title}
                      </Typography>
                      <Typography
                        variant="muted"
                        className="mt-1 text-[10px] leading-tight font-medium opacity-70"
                      >
                        {rec.reason}
                      </Typography>
                    </div>
                  </div>
                  <div className="bg-primary/20 group-hover:bg-primary absolute top-4 right-4 h-2 w-2 rounded-full transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="from-border/50 mb-4 h-px bg-linear-to-r via-transparent to-transparent" />
          <Typography
            variant="muted"
            className="text-center text-[9px] font-black tracking-widest uppercase opacity-40"
          >
            Verified Intelligence Protocol
          </Typography>
        </div>
      </div>
    </aside>
  );
}
