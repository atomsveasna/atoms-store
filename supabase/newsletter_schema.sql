-- ── Newsletter subscribers ───────────────────────────────────
create table if not exists newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  source     text default 'homepage',
  created_at timestamptz default now()
);

alter table newsletter_subscribers enable row level security;

create policy "newsletter_insert" on newsletter_subscribers
  for insert with check (true);
