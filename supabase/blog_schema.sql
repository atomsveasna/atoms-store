-- ── Blog posts table ─────────────────────────────────────────
create table if not exists blog_posts (
  id           uuid primary key default uuid_generate_v4(),
  slug         text unique not null,
  title        text not null,
  excerpt      text not null,
  content      text not null,
  category     text not null default 'tutorial',
  tags         jsonb default '[]',
  author       text not null default 'Atoms Team',
  cover_image  text,
  product_slug text,
  is_published boolean default true,
  published_at timestamptz default now(),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists idx_blog_slug     on blog_posts(slug);
create index if not exists idx_blog_category on blog_posts(category);
create index if not exists idx_blog_published on blog_posts(is_published, published_at);

create or replace trigger blog_updated_at
  before update on blog_posts
  for each row execute function update_updated_at();

-- RLS
alter table blog_posts enable row level security;

create policy "blog_public_read" on blog_posts
  for select using (is_published = true);
