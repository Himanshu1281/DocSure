-- DocSure initial schema: per-user profile, Medical ID and bookings.
-- Every table is protected by Row Level Security: a signed-in user can only
-- read and write their own rows. The anon key in the app is safe to ship
-- because of these policies.

-- Keeps updated_at current on every UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Profiles ────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null default '',
  subtitle    text not null default '',
  phone       text not null default '',
  updated_at  timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles: read own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Create an empty profile row for every new account
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Medical ID (one row per user) ───────────────────────────────────────
create table public.medical_ids (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  dossier_id   text not null,
  blood_group  text not null default '',
  allergies    text not null default '',
  organ_donor  boolean,
  height_cm    text not null default '',
  weight_kg    text not null default '',
  -- [{ id, name, frequency }]
  medications  jsonb not null default '[]'::jsonb,
  -- [{ id, name, relation, phone }]
  contacts     jsonb not null default '[]'::jsonb,
  updated_at   timestamptz not null default now()
);

create trigger medical_ids_updated_at
  before update on public.medical_ids
  for each row execute function public.set_updated_at();

alter table public.medical_ids enable row level security;

create policy "medical_ids: read own"   on public.medical_ids for select using (auth.uid() = user_id);
create policy "medical_ids: insert own" on public.medical_ids for insert with check (auth.uid() = user_id);
create policy "medical_ids: update own" on public.medical_ids for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "medical_ids: delete own" on public.medical_ids for delete using (auth.uid() = user_id);

-- ─── Bookings ────────────────────────────────────────────────────────────
create table public.bookings (
  -- Client-generated id so bookings made offline keep their identity when synced
  id          text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  -- Provider id of the listing (Google place id or "node-123" for OpenStreetMap)
  doctor_id   text not null,
  -- Snapshot of the listing at booking time: { id, name, specialty, hospital, phone, latitude, longitude }
  doctor      jsonb not null,
  starts_at   timestamptz not null,
  status      text not null default 'requested' check (status in ('requested', 'cancelled')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index bookings_user_starts_idx on public.bookings (user_id, starts_at);

-- A user can't hold two active bookings with the same doctor at the same time
create unique index bookings_no_double_booking
  on public.bookings (user_id, doctor_id, starts_at)
  where status <> 'cancelled';

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

alter table public.bookings enable row level security;

create policy "bookings: read own"   on public.bookings for select using (auth.uid() = user_id);
create policy "bookings: insert own" on public.bookings for insert with check (auth.uid() = user_id);
create policy "bookings: update own" on public.bookings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "bookings: delete own" on public.bookings for delete using (auth.uid() = user_id);
