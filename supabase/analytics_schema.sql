-- ── Analytics ────────────────────────────────────────────────
create table if not exists analytics_events (
  id         uuid primary key default uuid_generate_v4(),
  event      text not null, -- page_view | add_to_cart | checkout_start | order_placed | review_submitted
  path       text,
  referrer   text,
  country    text,
  metadata   jsonb default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_analytics_event   on analytics_events(event);
create index if not exists idx_analytics_path    on analytics_events(path);
create index if not exists idx_analytics_created on analytics_events(created_at);

alter table analytics_events enable row level security;

-- Only insert from server (service role)
create policy "analytics_insert" on analytics_events
  for insert with check (true);
