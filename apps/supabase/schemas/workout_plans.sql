-- Workout plans table
create table if not exists public.workout_plans (
  id bigint primary key,
  "day" text not null,
  date date not null,
  exercise text not null,
  sets integer not null,
  reps integer not null,
  duration text,
  completed boolean not null default false
);

alter table public.workout_plans enable row level security;

create policy "Public workout plans are viewable by everyone." on public.workout_plans
  for select using (true);