import { Sparkles } from 'lucide-react';
import { Badge, Button, EmptyState, typography } from '@/lib/components';

interface CoachEmptyStateProps {
  onSuggestionClick: (_suggestion: string) => void;
}

export default function CoachEmptyState({ onSuggestionClick }: CoachEmptyStateProps) {
  const suggestions = [
    { label: 'Analyze my squat form', desc: 'Technical breakdown and cues.' },
    { label: 'Optimize nutrition', desc: 'Fueling strategy for performance.' },
    { label: 'Review training volume', desc: 'Check for overtraining signs.' },
    { label: 'Suggest recovery', desc: 'Mobility routines for rest days.' },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 flex flex-1 flex-col items-center justify-center py-12 duration-500 md:py-24">
      <div className="relative">
        <div className="bg-primary/20 absolute -inset-6 animate-pulse rounded-full opacity-50 blur-3xl" />
        <EmptyState
          icon={Sparkles}
          title="Coach"
          description="Ready to help you reach your goals. Ask about training, nutrition, or recovery strategies."
          className="px-0 py-0"
          iconClassName="animate-pulse shadow-2xl transition-transform duration-500 hover:scale-105 rounded-3xl"
          action={
            <div className="mt-8 flex flex-col items-center gap-4">
              <Badge variant="success" className={`${typography.mutedXs} order-first mb-4`}>
                System Online
              </Badge>

              <div className="grid w-full max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion.label}
                    variant="outline"
                    onClick={() => onSuggestionClick(suggestion.label)}
                    className="hover:border-primary/50 hover:bg-accent/50 group flex h-auto flex-col items-start gap-1 p-6 whitespace-normal transition-all"
                  >
                    <span
                      className={`${typography.small} group-hover:text-primary transition-colors`}
                    >
                      {suggestion.label}
                    </span>
                    <span className={`${typography.mutedXs} font-normal opacity-70`}>
                      {suggestion.desc}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
