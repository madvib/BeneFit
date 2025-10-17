-- Goals table
create table if not exists public.goals (
  id bigint primary key,
  title text not null,
  description text not null,
  target_value numeric not null,
  current_value numeric not null,
  unit text not null,
  deadline date not null,
  status text check (status in ('active', 'completed', 'overdue')) not null
);

alter table public.goals enable row level security;

create policy "Public goals are viewable by everyone." on public.goals
  for select using (true);