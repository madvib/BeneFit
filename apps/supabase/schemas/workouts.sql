-- Workout history table
create table if not exists public.workouts (
  id bigint primary key,
  date date not null,
  type text not null,
  duration text not null,
  distance text,
  sets integer,
  laps integer,
  calories integer not null
);

alter table public.workouts enable row level security;

create policy "Public workouts are viewable by everyone." on public.workouts
  for select using (true);