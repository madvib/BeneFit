'use client';

import React from 'react';
import { Sparkles, Clock, Users, Star, ArrowRight, LayoutTemplate } from 'lucide-react';
import { Card, Button } from '@/lib/components';

export interface PlanSuggestionItem {
  id: string;
  title: string;
  category: string;
  rating: number;
  duration: string;
  users: string;
  image: React.ReactNode;
}

interface PlanSuggestionsProps {
  suggestions: PlanSuggestionItem[];
  onSelectPlan: (_planId: string) => void;
}

export default function PlanSuggestions({ suggestions, onSelectPlan }: PlanSuggestionsProps) {
  return (
    <Card
      title="Suggested for You"
      icon={Sparkles}
      className="border-border/50 bg-card h-full shadow-sm"
      headerClassName="border-b border-border/50"
      headerAction={
        <Button
          variant="link"
          size="sm"
          className="text-primary p-0 text-xs font-bold hover:underline"
        >
          View All
        </Button>
      }
    >
      <div className="space-y-4">
        {suggestions.map((plan) => (
          <div
            key={plan.id}
            className="group border-border hover:border-primary/30 hover:bg-accent/5 flex items-start gap-4 rounded-2xl border p-4 transition-all hover:shadow-sm"
          >
            <div className="bg-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl">
              {plan.image}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-start justify-between">
                <div>
                  <h4 className="text-foreground group-hover:text-primary font-bold transition-colors">
                    {plan.title}
                  </h4>
                  <p className="text-muted-foreground text-xs font-medium">{plan.category}</p>
                </div>
                <div className="bg-accent text-muted-foreground flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold">
                  <Star size={10} className="fill-current" />
                  {plan.rating}
                </div>
              </div>

              <div className="text-muted-foreground mb-3 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {plan.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {plan.users}
                </span>
              </div>

              <Button
                variant="link"
                onClick={() => onSelectPlan(plan.id)}
                className="text-primary hover:text-primary/80 flex items-center gap-1 p-0 text-xs font-bold transition-colors"
                size="sm"
              >
                View Plan <ArrowRight size={12} />
              </Button>
            </div>
          </div>
        ))}

        {suggestions.length === 0 && (
          <div className="border-border bg-accent/5 text-muted-foreground flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center">
            <LayoutTemplate size={32} className="mb-3 opacity-20" />
            <p className="text-sm">No suggestions available.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
