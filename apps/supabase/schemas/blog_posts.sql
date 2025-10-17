-- Blog posts table
create table if not exists public.blog_posts (
  id bigint primary key,
  title text not null,
  excerpt text not null,
  "date" date not null,
  author text not null,
  read_time text not null,
  category text not null,
  image text not null
);

alter table public.blog_posts enable row level security;

create policy "Public blog posts are viewable by everyone." on public.blog_posts
  for select using (true);