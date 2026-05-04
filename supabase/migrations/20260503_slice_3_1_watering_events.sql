create table if not exists public.watering_events (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  watered_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists watering_events_plant_id_watered_at_idx
on public.watering_events (plant_id, watered_at desc);

create index if not exists watering_events_user_id_watered_at_idx
on public.watering_events (user_id, watered_at desc);

alter table public.watering_events enable row level security;

drop policy if exists "Users can view their own watering events" on public.watering_events;
create policy "Users can view their own watering events"
on public.watering_events
for select
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.plants
    where plants.id = watering_events.plant_id
      and plants.user_id = auth.uid()
  )
);

drop policy if exists "Users can create watering events for their own plants" on public.watering_events;
create policy "Users can create watering events for their own plants"
on public.watering_events
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.plants
    where plants.id = watering_events.plant_id
      and plants.user_id = auth.uid()
      and plants.archived_at is null
  )
);
