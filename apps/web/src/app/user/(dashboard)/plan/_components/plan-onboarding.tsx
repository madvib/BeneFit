'use client';

import { useState } from 'react';
import { Sparkles, Layout, Dumbbell, ArrowRight, Zap, Target, ShieldCheck } from 'lucide-react';
import { Button } from '@/lib/components/ui-primitives';
import { fitnessPlan } from '@bene/react-api-client';
import GoalSelectionForm from './goal-selection-form';

interface PlanOnboardingProps {
  onGenerate: (_request: fitnessPlan.GeneratePlanRequest) => void;
  onBrowse: () => void;
  isLoading?: boolean;
}

export default function PlanOnboarding({ onGenerate, onBrowse, isLoading }: PlanOnboardingProps) {
  const [showGoalForm, setShowGoalForm] = useState(false);

  if (showGoalForm) {
    return (
      <div className="container mx-auto max-w-6xl p-6">
        <div className="mb-8 text-center">
          <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <Dumbbell size={40} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Let&apos;s build your plan.</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            We&apos;ll create a custom training schedule based on your goals and equipment.
          </p>
        </div>

        <GoalSelectionForm onGenerate={onGenerate} isLoading={isLoading} />

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowGoalForm(false)}
            className="text-muted-foreground hover:text-foreground text-sm underline"
            disabled={isLoading}
          >
            ← Back to options
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
      {/* Hero Section */}
      <div className="relative mb-6 text-center">
        <div className="bg-primary/20 absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" />

        <div className="bg-background border-muted mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium shadow-sm">
          <Sparkles size={16} className="text-primary animate-pulse" />
          <span className="text-foreground">AI-Powered Training</span>
        </div>

        <h1 className="text-foreground mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
          Everything you need <br />
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            for your next peak.
          </span>
        </h1>

        <p className="text-muted-foreground mx-auto max-w-xl text-lg md:text-xl">
          Start your transformation today with a personalized fitness plan tailored to your goals,
          equipment, and schedule.
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* AI Generation Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5 p-8 transition-all hover:border-blue-500/40 hover:shadow-xl">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <Zap size={32} />
          </div>

          <h3 className="text-foreground mb-3 text-2xl font-bold">Generate with AI</h3>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Our AI coach analyzes your profile and goals to create a high-performance routine that
            adapts to your progress.
          </p>

          <Button
            onClick={() => setShowGoalForm(true)}
            isLoading={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-7 text-lg font-bold transition-transform active:scale-95"
          >
            Create My Plan <ArrowRight size={20} />
          </Button>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-sm font-medium text-blue-500/70">
              <Target size={14} /> Goal-Oriented
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-purple-500/70">
              <Layout size={14} /> Custom Schedule
            </div>
          </div>
        </div>

        {/* Browse Templates Card */}
        <div className="group border-border bg-background hover:border-muted-foreground/30 relative overflow-hidden rounded-3xl border p-8 transition-all hover:shadow-lg">
          <div className="bg-muted text-foreground mb-6 flex h-14 w-14 items-center justify-center rounded-2xl">
            <Dumbbell size={32} />
          </div>

          <h3 className="text-foreground mb-3 text-2xl font-bold">Browse Programs</h3>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Choose from a collection of tried-and-true training programs designed by professional
            athletes and coaches.
          </p>

          <Button
            onClick={onBrowse}
            variant="outline"
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-7 text-lg font-bold"
          >
            Explore Library <Layout size={20} />
          </Button>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
              <ShieldCheck size={14} /> Athlete Approved
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
              <Sparkles size={14} /> Pure Science
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof / Footer info */}
      <p className="text-muted-foreground mt-8 text-sm">
        Join over <span className="text-foreground font-bold">10,000+</span> athletes reaching
        their potential.
      </p>
    </div>
  );
}
