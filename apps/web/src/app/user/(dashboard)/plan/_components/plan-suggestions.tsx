'use client';

import React from 'react';
import { Sparkles, Clock, Users, Star, ArrowRight, LayoutTemplate } from 'lucide-react';
import { Card, Button, Typography, Badge } from '@/lib/components';

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
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Sparkles size={20} />
          </div>
          <div>
            <Typography variant="h3" className="font-black tracking-tighter uppercase italic">
              AI Suggestions
            </Typography>
            <Typography
              variant="muted"
              className="text-[10px] font-black tracking-widest uppercase"
            >
              Personalized Path
            </Typography>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary rounded-xl text-xs font-black tracking-widest uppercase transition-all"
        >
          View All Library
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {suggestions.map((plan) => (
          <Card
            key={plan.id}
            className="group from-accent/40 via-background to-background border-border/50 hover:border-primary/40 relative overflow-hidden bg-linear-to-br shadow-xl transition-all duration-300 hover:shadow-2xl"
          >
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div className="bg-primary/10 border-primary/20 flex h-14 w-14 items-center justify-center rounded-2xl border text-3xl shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {plan.image}
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-emerald-600 uppercase ring-1 ring-emerald-500/20">
                  <Star size={12} className="fill-current" />
                  {plan.rating}
                </div>
              </div>

              <div className="mb-6">
                <Badge
                  variant="outline"
                  className="border-primary/20 bg-primary/5 mb-2 text-[9px] font-black tracking-widest uppercase"
                >
                  {plan.category}
                </Badge>
                <Typography
                  variant="h4"
                  className="group-hover:text-primary mb-2 text-xl leading-tight font-black tracking-tight italic transition-colors"
                >
                  {plan.title}
                </Typography>

                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground flex items-center gap-1.5 font-bold italic">
                    <Clock size={12} className="text-primary" />
                    <Typography
                      variant="muted"
                      className="text-[10px] font-black tracking-tighter uppercase"
                    >
                      {plan.duration}
                    </Typography>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1.5 font-bold italic">
                    <Users size={12} className="text-primary" />
                    <Typography
                      variant="muted"
                      className="text-[10px] font-black tracking-tighter uppercase"
                    >
                      {plan.users} Active
                    </Typography>
                  </div>
                </div>
              </div>

              <Button
                variant="default"
                onClick={() => onSelectPlan(plan.id)}
                className="w-full gap-2 rounded-2xl py-6 font-black tracking-widest uppercase shadow-[0_8px_20px_-10px_rgba(var(--primary),0.5)] transition-all active:scale-95"
              >
                <Typography variant="small" className="text-primary-foreground font-black">
                  Deep Dive
                </Typography>
                <ArrowRight
                  size={16}
                  className="text-primary-foreground transition-transform group-hover:translate-x-1"
                />
              </Button>
            </div>
          </Card>
        ))}

        {suggestions.length === 0 && (
          <div className="bg-accent/20 border-border/50 col-span-full rounded-3xl border border-dashed py-16 text-center">
            <LayoutTemplate size={48} className="text-muted-foreground mx-auto mb-4 opacity-20" />
            <Typography variant="h4" className="mb-1 font-black italic">
              No Suggestions Yet
            </Typography>
            <Typography variant="muted" className="text-xs font-bold tracking-widest uppercase">
              Update your goals to see tailored plans.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
