-- ── Bundles / kits ───────────────────────────────────────────
create table if not exists bundles (
  id             uuid primary key default uuid_generate_v4(),
  slug           text unique not null,
  name           text not null,
  tagline        text not null,
  description    text not null,
  cover_image    text,
  original_price numeric(10,2) not null,
  bundle_price   numeric(10,2) not null,
  currency       text default 'USD',
  is_featured    boolean default false,
  is_published   boolean default true,
  items          jsonb not null default '[]',
  includes       jsonb default '[]',
  tags           jsonb default '[]',
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index if not exists idx_bundles_slug     on bundles(slug);
create index if not exists idx_bundles_featured on bundles(is_featured, is_published);

alter table bundles enable row level security;

create policy "bundles_public_read" on bundles
  for select using (is_published = true);
