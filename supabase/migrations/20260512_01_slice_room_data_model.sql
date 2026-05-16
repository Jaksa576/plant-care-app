create table if not exists public.plant_rooms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  sort_order integer,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plant_rooms_name_not_blank check (
    nullif(btrim(name), '') is not null
  )
);

drop trigger if exists set_plant_rooms_updated_at on public.plant_rooms;

create trigger set_plant_rooms_updated_at
before update on public.plant_rooms
for each row
execute function public.set_updated_at();

create unique index if not exists plant_rooms_user_active_name_key
on public.plant_rooms (user_id, lower(btrim(name)))
where archived_at is null;

create index if not exists plant_rooms_user_id_sort_order_idx
on public.plant_rooms (user_id, sort_order, created_at);

alter table public.plant_rooms enable row level security;

drop policy if exists "Users can view their own plant rooms" on public.plant_rooms;
create policy "Users can view their own plant rooms"
on public.plant_rooms
for select
using (auth.uid() = user_id);

drop policy if exists "Users can create their own plant rooms" on public.plant_rooms;
create policy "Users can create their own plant rooms"
on public.plant_rooms
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own plant rooms" on public.plant_rooms;
create policy "Users can update their own plant rooms"
on public.plant_rooms
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

alter table public.plants
add column if not exists room_id uuid references public.plant_rooms (id) on delete set null;

create index if not exists plants_user_id_room_id_idx
on public.plants (user_id, room_id)
where archived_at is null;

with legacy_room_names as (
  select
    user_id,
    (array_agg(btrim(location) order by created_at, id))[1] as name,
    min(created_at) as first_seen_at
  from public.plants
  where nullif(btrim(coalesce(location, '')), '') is not null
  group by user_id, lower(btrim(location))
),
legacy_rooms as (
  select
    user_id,
    name,
    row_number() over (
      partition by user_id
      order by first_seen_at, lower(name)
    ) as sort_order
  from legacy_room_names
)
insert into public.plant_rooms (user_id, name, sort_order)
select legacy_rooms.user_id, legacy_rooms.name, legacy_rooms.sort_order
from legacy_rooms
where not exists (
  select 1
  from public.plant_rooms
  where plant_rooms.user_id = legacy_rooms.user_id
    and plant_rooms.archived_at is null
    and lower(btrim(plant_rooms.name)) = lower(btrim(legacy_rooms.name))
);

update public.plants
set room_id = plant_rooms.id
from public.plant_rooms
where plants.room_id is null
  and plants.user_id = plant_rooms.user_id
  and plant_rooms.archived_at is null
  and nullif(btrim(coalesce(plants.location, '')), '') is not null
  and lower(btrim(plants.location)) = lower(btrim(plant_rooms.name));

create or replace function public.validate_plant_room_ownership()
returns trigger
language plpgsql
as $$
begin
  if new.room_id is not null and not exists (
    select 1
    from public.plant_rooms
    where plant_rooms.id = new.room_id
      and plant_rooms.user_id = new.user_id
      and plant_rooms.archived_at is null
  ) then
    raise exception 'plant room must belong to the same user and be active'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_plants_room_ownership on public.plants;

create trigger validate_plants_room_ownership
before insert or update of user_id, room_id on public.plants
for each row
execute function public.validate_plant_room_ownership();
