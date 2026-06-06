alter table public.user_app_preferences
add column if not exists default_new_plant_reminders_enabled boolean;
