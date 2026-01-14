import { Sparkles } from 'lucide-react';
import { Badge, Button, EmptyState, typography } from '@/lib/components';

interface CoachEmptyStateProps {
    onSuggestionClick: (_suggestion: string) => void;
}

export default function CoachEmptyState({ onSuggestionClick }: CoachEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 md:py-24 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative">
         <div className="bg-primary/20 absolute -inset-6 animate-pulse rounded-full opacity-50 blur-3xl" />
         <EmptyState
            icon={Sparkles}
            title="Elite Intelligence"
            description="Your AI coach is calibrated and ready. Ask for training optimizations, diet protocols, or performance breakdowns."
            className="px-0 py-0"
            iconClassName="animate-pulse shadow-2xl transition-transform duration-500 hover:scale-105 rounded-3xl"
            action={
                <div className="mt-8 flex flex-col items-center gap-4">
                     <Badge variant="success" className={`${typography.mutedXs} order-first mb-4`}>
                        AI Coach Active
                     </Badge>
                     
                     <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 text-left">
                        {[
                          'Improve squat depth',
                          "Fat loss protocol",
                          'Analyze volume',
                          'Recovery plan',
                        ].map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            onClick={() => onSuggestionClick(suggestion)}
                            className="flex h-auto flex-col items-start gap-1 p-6 whitespace-normal hover:border-primary/50 hover:bg-accent/50 group transition-all"
                          >
                            <span className={`${typography.small} group-hover:text-primary transition-colors`}>
                              {suggestion}
                            </span>
                            <span className={`${typography.mutedXs} font-normal opacity-70`}>
                              Ask coach to optimize your routine.
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
