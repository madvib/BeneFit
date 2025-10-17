-- Plans table
create table if not exists public.plans (
  id bigint primary key,
  name text not null,
  description text not null,
  duration text not null,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')) not null,
  category text not null,
  progress numeric not null
);

alter table public.plans enable row level security;

create policy "Public plans are viewable by everyone." on public.plans
  for select using (true);