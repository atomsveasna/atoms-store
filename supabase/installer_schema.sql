-- ── Installer / Partner portal ───────────────────────────────
create table if not exists installer_applications (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  company      text not null,
  email        text not null,
  phone        text not null,
  city         text not null,
  experience   text not null, -- beginner | intermediate | professional
  projects     text,          -- describe typical projects
  monthly_volume text,        -- estimated monthly order volume
  status       text default 'pending', -- pending | approved | rejected
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists idx_installer_status on installer_applications(status);
create index if not exists idx_installer_email  on installer_applications(email);

alter table installer_applications enable row level security;

create policy "installer_insert" on installer_applications
  for insert with check (true);
