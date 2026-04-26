create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nickname text,
  common_name text,
  scientific_name text,
  location text,
  notes text,
  watering_interval_days integer,
  watering_guidance text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plants_label_required check (
    nullif(btrim(coalesce(nickname, '')), '') is not null
    or nullif(btrim(coalesce(common_name, '')), '') is not null
  ),
  constraint plants_watering_interval_positive check (
    watering_interval_days is null or watering_interval_days > 0
  )
);

drop trigger if exists set_plants_updated_at on public.plants;

create trigger set_plants_updated_at
before update on public.plants
for each row
execute function public.set_updated_at();

create index if not exists plants_user_id_created_at_idx
on public.plants (user_id, created_at desc);

create index if not exists plants_user_id_archived_at_idx
on public.plants (user_id, archived_at);

alter table public.plants enable row level security;

drop policy if exists "Users can view their own plants" on public.plants;
create policy "Users can view their own plants"
on public.plants
for select
using (auth.uid() = user_id);

drop policy if exists "Users can create their own plants" on public.plants;
create policy "Users can create their own plants"
on public.plants
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own plants" on public.plants;
create policy "Users can update their own plants"
on public.plants
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
