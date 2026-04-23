-- ── Atoms Store — Supabase Schema ────────────────────────────
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Products ──────────────────────────────────────────────────
create table if not exists products (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  name          text not null,
  tagline       text not null,
  description   text not null,
  long_description text,
  category      text not null,
  status        text not null default 'in_stock',
  price         numeric(10,2) not null,
  currency      text not null default 'USD',
  sku           text unique not null,
  features      jsonb not null default '[]',
  specs         jsonb not null default '[]',
  package_contents jsonb not null default '[]',
  downloads     jsonb not null default '[]',
  faqs          jsonb not null default '[]',
  related_slugs jsonb not null default '[]',
  works_with_platforms jsonb not null default '[]',
  doc_slug      text,
  firmware_version text,
  revision_history jsonb,
  is_new        boolean default false,
  is_featured   boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Product images ────────────────────────────────────────────
create table if not exists product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid references products(id) on delete cascade,
  src         text not null,
  alt         text not null,
  type        text not null, -- render | photo | diagram
  sort_order  int default 0
);

-- ── Docs ──────────────────────────────────────────────────────
create table if not exists docs (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  product_slug  text,
  title         text not null,
  description   text,
  category      text not null, -- getting-started | installation | configuration | api | firmware | troubleshooting | downloads
  content       text not null, -- MDX/Markdown content
  sort_order    int default 0,
  tags          jsonb default '[]',
  is_published  boolean default true,
  last_updated  timestamptz default now(),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Orders ────────────────────────────────────────────────────
create table if not exists orders (
  id              uuid primary key default uuid_generate_v4(),
  order_number    text unique not null,
  customer_name   text not null,
  customer_email  text,
  customer_phone  text not null,
  shipping_address jsonb not null,
  subtotal        numeric(10,2) not null,
  shipping_fee    numeric(10,2) default 0,
  total           numeric(10,2) not null,
  currency        text default 'USD',
  payment_method  text not null, -- aba_transfer | cash_on_delivery
  payment_proof_url text,
  status          text default 'pending_payment',
  notes           text,
  items           jsonb not null default '[]',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── Support requests ──────────────────────────────────────────
create table if not exists support_requests (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  email        text not null,
  phone        text,
  order_id     text,
  product_slug text,
  category     text not null,
  subject      text,
  message      text not null,
  status       text default 'open',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── Product registration ──────────────────────────────────────
create table if not exists product_registrations (
  id               uuid primary key default uuid_generate_v4(),
  customer_name    text not null,
  customer_email   text not null,
  product_slug     text not null,
  serial_number    text,
  purchase_date    date,
  purchase_order_id text,
  notes            text,
  created_at       timestamptz default now()
);

-- ── Indexes ───────────────────────────────────────────────────
create index if not exists idx_products_slug      on products(slug);
create index if not exists idx_products_category  on products(category);
create index if not exists idx_products_featured  on products(is_featured);
create index if not exists idx_docs_slug          on docs(slug);
create index if not exists idx_docs_product_slug  on docs(product_slug);
create index if not exists idx_docs_category      on docs(category);
create index if not exists idx_orders_number      on orders(order_number);
create index if not exists idx_orders_email       on orders(customer_email);
create index if not exists idx_orders_status      on orders(status);

-- ── Updated_at trigger ────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

create or replace trigger docs_updated_at
  before update on docs
  for each row execute function update_updated_at();

create or replace trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ── RLS (Row Level Security) ──────────────────────────────────
-- Products and docs are public read
alter table products enable row level security;
alter table docs enable row level security;
alter table orders enable row level security;
alter table support_requests enable row level security;
alter table product_registrations enable row level security;

-- Public can read products
create policy "products_public_read" on products
  for select using (true);

-- Public can read published docs
create policy "docs_public_read" on docs
  for select using (is_published = true);

-- Orders: insert only (customers can create, not read others)
create policy "orders_insert" on orders
  for insert with check (true);

-- Support requests: insert only
create policy "support_insert" on support_requests
  for insert with check (true);

-- Product registrations: insert only
create policy "registrations_insert" on product_registrations
  for insert with check (true);
