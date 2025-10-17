-- Chart data table
create table if not exists public.chart_data (
  "date" date not null,
  "value" numeric not null
);

alter table public.chart_data enable row level security;

create policy "Public chart data is viewable by everyone." on public.chart_data
  for select using (true);