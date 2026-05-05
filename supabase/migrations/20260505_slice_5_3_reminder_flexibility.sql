alter table public.watering_reminders
add column if not exists reminder_mode text not null default 'after_watering';

alter table public.watering_reminders
drop constraint if exists watering_reminders_mode_check;

alter table public.watering_reminders
add constraint watering_reminders_mode_check
check (reminder_mode in ('after_watering', 'fixed_schedule'));
