-- Chats table
create table if not exists public.chats (
  id bigint primary key,
  title text not null,
  last_message text not null,
  "timestamp" timestamptz not null,
  unread boolean not null default false
);

alter table public.chats enable row level security;

create policy "Public chats are viewable by everyone." on public.chats
  for select using (true);