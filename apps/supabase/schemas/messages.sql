-- Messages table
create table if not exists public.messages (
  id bigint primary key,
  content text not null,
  sender text check (sender in ('user', 'coach')) not null,
  "timestamp" timestamptz not null
);

alter table public.messages enable row level security;

create policy "Public messages are viewable by everyone." on public.messages
  for select using (true);