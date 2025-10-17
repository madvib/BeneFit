-- Plan suggestions table
create table if not exists public.plan_suggestions (
  id bigint primary key,
  name text not null,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')) not null,
  duration text not null,
  category text not null
);

alter table public.plan_suggestions enable row level security;

create policy "Public plan suggestions are viewable by everyone." on public.plan_suggestions
  for select using (true);