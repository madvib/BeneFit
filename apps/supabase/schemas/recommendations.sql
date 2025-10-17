-- Recommendations table
create table if not exists public.recommendations (
  id bigint primary key,
  title text not null,
  description text not null,
  category text not null
);

alter table public.recommendations enable row level security;

create policy "Public recommendations are viewable by everyone." on public.recommendations
  for select using (true);