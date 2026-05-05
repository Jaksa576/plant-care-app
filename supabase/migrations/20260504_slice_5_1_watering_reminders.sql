create table if not exists public.watering_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plant_id uuid not null references public.plants (id) on delete cascade,
  reminder_type text not null default 'watering',
  enabled boolean not null default true,
  next_reminder_date date,
  reminder_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint watering_reminders_type_check check (reminder_type = 'watering'),
  constraint watering_reminders_unique_type unique (user_id, plant_id, reminder_type)
);

drop trigger if exists set_watering_reminders_updated_at on public.watering_reminders;

create trigger set_watering_reminders_updated_at
before update on public.watering_reminders
for each row
execute function public.set_updated_at();

create index if not exists watering_reminders_user_id_next_date_idx
on public.watering_reminders (user_id, next_reminder_date);

create index if not exists watering_reminders_plant_id_idx
on public.watering_reminders (plant_id);

alter table public.watering_reminders enable row level security;

drop policy if exists "Users can view their own watering reminders" on public.watering_reminders;
create policy "Users can view their own watering reminders"
on public.watering_reminders
for select
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.plants
    where plants.id = watering_reminders.plant_id
      and plants.user_id = auth.uid()
  )
);

drop policy if exists "Users can create watering reminders for their own plants" on public.watering_reminders;
create policy "Users can create watering reminders for their own plants"
on public.watering_reminders
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.plants
    where plants.id = watering_reminders.plant_id
      and plants.user_id = auth.uid()
      and plants.archived_at is null
  )
);

drop policy if exists "Users can update their own watering reminders" on public.watering_reminders;
create policy "Users can update their own watering reminders"
on public.watering_reminders
for update
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.plants
    where plants.id = watering_reminders.plant_id
      and plants.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.plants
    where plants.id = watering_reminders.plant_id
      and plants.user_id = auth.uid()
      and plants.archived_at is null
  )
);
