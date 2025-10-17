-- Activity Feed table
create table if not exists public.activity_items (
  id bigint primary key,
  type text check (type in ('workout', 'nutrition', 'goal', 'achievement', 'progress')) not null,
  title text not null,
  description text not null,
  timestamp timestamptz not null,
  "user" text not null,
  avatar text not null,
  duration text,
  calories integer,
  "value" numeric,
  goal numeric
);

alter table public.activity_items enable row level security;

create policy "Public activity items are viewable by everyone." on public.activity_items
  for select using (true);