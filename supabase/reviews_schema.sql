-- ── Product reviews ──────────────────────────────────────────
create table if not exists product_reviews (
  id           uuid primary key default uuid_generate_v4(),
  product_slug text not null,
  author_name  text not null,
  author_email text,
  rating       int not null check (rating between 1 and 5),
  title        text,
  body         text not null,
  is_verified  boolean default false,
  is_published boolean default false, -- admin approves before showing
  created_at   timestamptz default now()
);

create index if not exists idx_reviews_product on product_reviews(product_slug, is_published);

alter table product_reviews enable row level security;

-- Public can read approved reviews
create policy "reviews_public_read" on product_reviews
  for select using (is_published = true);

-- Anyone can submit a review
create policy "reviews_insert" on product_reviews
  for insert with check (true);
