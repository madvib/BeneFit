-- Service connections table
create table if not exists public.service_connections (
  id bigint primary key,
  name text not null,
  description text not null,
  connected boolean not null default false,
  logo text not null,
  last_sync timestamptz,
  data_type text[] not null
);

alter table public.service_connections enable row level security;

create policy "Public service connections are viewable by everyone." on public.service_connections
  for select using (true);