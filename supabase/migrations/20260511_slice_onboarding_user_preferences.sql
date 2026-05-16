create table if not exists public.user_app_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  onboarding_completed_at timestamptz,
  setup_checklist_dismissed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_app_preferences_user_id_key unique (user_id)
);

drop trigger if exists set_user_app_preferences_updated_at on public.user_app_preferences;

create trigger set_user_app_preferences_updated_at
before update on public.user_app_preferences
for each row
execute function public.set_updated_at();

create index if not exists user_app_preferences_user_id_idx
on public.user_app_preferences (user_id);

alter table public.user_app_preferences enable row level security;

drop policy if exists "Users can view their own app preferences" on public.user_app_preferences;
create policy "Users can view their own app preferences"
on public.user_app_preferences
for select
using (auth.uid() = user_id);

drop policy if exists "Users can create their own app preferences" on public.user_app_preferences;
create policy "Users can create their own app preferences"
on public.user_app_preferences
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own app preferences" on public.user_app_preferences;
create policy "Users can update their own app preferences"
on public.user_app_preferences
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
