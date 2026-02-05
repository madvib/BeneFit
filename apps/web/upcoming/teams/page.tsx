'use client';

import { Users, Trophy, Hash, Plus, Settings } from 'lucide-react';
import { Card } from '@/lib/components';

const TEAMS = [
  {
    id: '1',
    name: 'Marathon Runners 2025',
    members: 124,
    active: 12,
    category: 'Running',
    image: '🏃',
  },
  {
    id: '2',
    name: 'Morning Yoga Club',
    members: 85,
    active: 5,
    category: 'Yoga',
    image: '🧘',
  },
  {
    id: '3',
    name: 'HIIT Blasters',
    members: 230,
    active: 45,
    category: 'HIIT',
    image: '🔥',
  },
];

const CHANNELS = [
  { id: '1', name: 'general', type: 'text' },
  { id: '2', name: 'workouts', type: 'text' },
  { id: '3', name: 'nutrition', type: 'text' },
  { id: '4', name: 'wins', type: 'text' },
];

export default function TeamsPage() {
  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6 lg:p-8">
      <div className="grid h-[calc(100vh-140px)] grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
        {/* Left Sidebar: Teams List & Channels */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {/* My Teams */}
          <Card
            title="My Teams"
            icon={Users}
            className="border-border bg-card flex-1 overflow-hidden"
            headerClassName="border-b border-border"
            headerAction={
              <button className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-full p-1.5">
                <Plus size={16} />
              </button>
            }
          >
            <div className="h-full space-y-2 overflow-y-auto pr-2">
              {TEAMS.map((team) => (
                <button
                  key={team.id}
                  className="hover:bg-accent/50 flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors"
                >
                  <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-lg text-xl">
                    {team.image}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-foreground truncate font-medium">{team.name}</p>
                    <p className="text-muted-foreground text-xs">{team.members} members</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Channels */}
          <Card
            title="Channels"
            icon={Hash}
            className="border-border bg-card flex-1"
            headerClassName="border-b border-border"
          >
            <div className="space-y-1">
              {CHANNELS.map((channel) => (
                <button
                  key={channel.id}
                  className="text-muted-foreground hover:bg-accent/50 hover:text-foreground flex w-full items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
                >
                  <Hash size={16} />
                  <span className="font-medium">{channel.name}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Center: Chat / Feed */}
        <Card
          className="border-border bg-card flex flex-col overflow-hidden lg:col-span-6"
          headerClassName="border-b border-border py-3"
          title="#general"
          icon={Hash}
          headerAction={
            <div className="text-muted-foreground flex items-center gap-4">
              <Users size={18} />
              <Settings size={18} />
            </div>
          }
          footer={
            <div className="bg-accent/50 flex items-center gap-2 rounded-xl px-4 py-3">
              <Plus size={20} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Message #general"
                className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
              />
            </div>
          }
          footerClassName="border-t border-border p-4"
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="flex flex-col gap-4">
              {/* Message 1 */}
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/20" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-foreground font-bold">Sarah Chen</span>
                    <span className="text-muted-foreground text-xs">10:42 AM</span>
                  </div>
                  <p className="text-foreground/90">
                    Just finished the morning run! The weather is perfect today. 🌞
                  </p>
                </div>
              </div>
              {/* Message 2 */}
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/20" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-foreground font-bold">Mike Ross</span>
                    <span className="text-muted-foreground text-xs">10:45 AM</span>
                  </div>
                  <p className="text-foreground/90">
                    Nice work Sarah! I&apos;m hitting the gym in an hour. Anyone want to join for
                    leg day?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Sidebar: Team Stats & Members */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {/* Team Goal */}
          <Card
            title="Weekly Goal"
            icon={Trophy}
            className="border-border from-primary/10 bg-gradient-to-br to-transparent"
            headerClassName="bg-transparent border-b border-primary/10"
          >
            <p className="text-foreground mb-2 text-2xl font-bold">450 / 500 km</p>
            <div className="bg-background/50 h-2 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full w-[90%] rounded-full" />
            </div>
            <p className="text-muted-foreground mt-2 text-xs">Team total distance</p>
          </Card>

          {/* Active Members */}
          <Card
            title="Online - 12"
            icon={Users}
            className="border-border bg-card flex-1"
            headerClassName="border-b border-border"
          >
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 px-2">
                  <div className="relative">
                    <div className="bg-accent h-8 w-8 rounded-full" />
                    <div className="border-card absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 bg-green-500" />
                  </div>
                  <span className="text-foreground text-sm font-medium">User {i}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
