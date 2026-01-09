'use client';

import { Calendar, Users, ChevronRight } from 'lucide-react';
import { Card } from '@/lib/components';

export interface Event {
  id: string;
  title: string;
  date: string;
  image: string;
  participants: number;
}

export interface Team {
  id: string;
  name: string;
  members: number;
  activityType: string;
  image: string;
}

interface ExploreViewProps {
  events: Event[];
  featuredTeams: Team[];
}

export default function ExploreView({ events, featuredTeams }: ExploreViewProps) {
  return (
    <div className="mx-auto max-w-400 p-4 md:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground relative mb-12 overflow-hidden rounded-3xl px-8 py-16 md:px-16">
        <div className="relative z-10 max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Discover Your Next Challenge
          </h1>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Find local events, join communities, and connect with expert coaches to elevate your
            fitness journey.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-background text-primary rounded-full px-6 py-3 font-bold transition-transform hover:scale-105">
              Find Events
            </button>
            <button className="border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full border px-6 py-3 font-bold backdrop-blur-sm transition-colors">
              Browse Teams
            </button>
          </div>
        </div>
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-40 bottom-0 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
      </div>

      {/* Upcoming Events */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-foreground text-2xl font-bold">Upcoming Events</h2>
          <button className="text-primary flex items-center gap-1 text-sm font-medium hover:underline">
            View all <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              className="group border-border bg-card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
              image={undefined}
            >
              <div className="bg-accent/50 -mx-6 -mt-6 mb-6 flex aspect-video w-[calc(100%+3rem)] items-center justify-center text-6xl">
                {/* Fallback image if needed since we removed category logic for placeholder */}
                <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
              </div>

              <h3 className="text-foreground mb-2 text-xl font-bold">{event.title}</h3>
              <div className="text-muted-foreground space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{event.participants} participating</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Teams */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-foreground text-2xl font-bold">Featured Teams</h2>
          <button className="text-primary flex items-center gap-1 text-sm font-medium hover:underline">
            View all <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTeams.map((team) => (
            <Card
              key={team.id}
              className="border-border bg-card hover:border-primary/50 flex flex-col items-center text-center transition-all hover:shadow-md"
            >
              <div className="bg-accent mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
                <img src={team.image} alt={team.name} className="h-full w-full object-cover" />
              </div>
              <h3 className="text-foreground mb-1 text-lg font-bold">{team.name}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{team.activityType}</p>
              <div className="text-muted-foreground mt-auto flex items-center gap-2 text-xs font-medium">
                <Users size={14} />
                <span>{team.members} members</span>
              </div>
              <button className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground mt-4 w-full rounded-xl py-2 text-sm font-bold transition-colors">
                Join Team
              </button>
            </Card>
          ))}
          {/* Create Team Card */}
          <button className="border-border bg-accent/5 hover:border-primary/50 hover:bg-accent/10 flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-all">
            <div className="bg-background mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-sm">
              <Users size={32} className="text-primary" />
            </div>
            <h3 className="text-foreground text-lg font-bold">Create a Team</h3>
            <p className="text-muted-foreground text-sm">Start your own community</p>
          </button>
        </div>
      </section>
    </div>
  );
}
