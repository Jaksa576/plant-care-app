create table if not exists public.google_calendar_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'google',
  encrypted_refresh_token text not null,
  token_iv text not null,
  token_auth_tag text not null,
  calendar_id text not null default 'primary',
  connected_at timestamptz not null default timezone('utc', now()),
  last_sync_status text not null default 'idle',
  last_sync_error text,
  last_synced_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint google_calendar_connections_provider_check check (provider = 'google'),
  constraint google_calendar_connections_status_check check (
    last_sync_status in ('idle', 'success', 'error', 'cleanup_warning')
  ),
  constraint google_calendar_connections_user_provider_key unique (user_id, provider)
);

create trigger set_google_calendar_connections_updated_at
before update on public.google_calendar_connections
for each row
execute function public.set_updated_at();

alter table public.google_calendar_connections enable row level security;

create policy "Users can read their Google calendar connection"
on public.google_calendar_connections
for select
using (auth.uid() = user_id);

create policy "Users can insert their Google calendar connection"
on public.google_calendar_connections
for insert
with check (auth.uid() = user_id);

create policy "Users can update their Google calendar connection"
on public.google_calendar_connections
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their Google calendar connection"
on public.google_calendar_connections
for delete
using (auth.uid() = user_id);

create table if not exists public.google_calendar_event_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reminder_id uuid not null references public.watering_reminders(id) on delete cascade,
  google_event_id text not null,
  calendar_id text not null default 'primary',
  last_sync_status text not null default 'idle',
  last_sync_error text,
  last_synced_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint google_calendar_event_links_status_check check (
    last_sync_status in ('idle', 'success', 'error', 'cleanup_warning')
  ),
  constraint google_calendar_event_links_user_reminder_key unique (user_id, reminder_id)
);

create index if not exists google_calendar_event_links_reminder_idx
on public.google_calendar_event_links (reminder_id);

create trigger set_google_calendar_event_links_updated_at
before update on public.google_calendar_event_links
for each row
execute function public.set_updated_at();

alter table public.google_calendar_event_links enable row level security;

create policy "Users can read their Google calendar event links"
on public.google_calendar_event_links
for select
using (auth.uid() = user_id);

create policy "Users can insert event links for their reminders"
on public.google_calendar_event_links
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.watering_reminders reminder
    where reminder.id = reminder_id
      and reminder.user_id = auth.uid()
  )
);

create policy "Users can update their Google calendar event links"
on public.google_calendar_event_links
for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.watering_reminders reminder
    where reminder.id = reminder_id
      and reminder.user_id = auth.uid()
  )
);

create policy "Users can delete their Google calendar event links"
on public.google_calendar_event_links
for delete
using (auth.uid() = user_id);
