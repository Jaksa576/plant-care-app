create table if not exists public.care_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_key text not null,
  profile_level text not null,
  display_name text not null,
  accepted_scientific_name text,
  accepted_common_name text not null,
  taxon_rank text,
  watering_interval_days_default integer not null,
  watering_interval_days_min integer,
  watering_interval_days_max integer,
  dryness_preference text not null,
  watering_guidance text not null,
  light_guidance text,
  soil_pot_drainage_guidance text,
  humidity_guidance text,
  seasonal_note text,
  beginner_note text,
  toxicity_note text,
  match_confidence text not null default 'medium',
  review_status text not null default 'draft',
  source_summary text,
  source_links jsonb,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint care_profiles_profile_key_unique unique (profile_key),
  constraint care_profiles_profile_key_not_blank check (
    nullif(btrim(profile_key), '') is not null
  ),
  constraint care_profiles_display_name_not_blank check (
    nullif(btrim(display_name), '') is not null
  ),
  constraint care_profiles_common_name_not_blank check (
    nullif(btrim(accepted_common_name), '') is not null
  ),
  constraint care_profiles_profile_level_check check (
    profile_level in ('species', 'genus', 'care_group', 'fallback')
  ),
  constraint care_profiles_interval_positive_check check (
    watering_interval_days_default > 0
    and (
      watering_interval_days_min is null
      or watering_interval_days_min > 0
    )
    and (
      watering_interval_days_max is null
      or watering_interval_days_max > 0
    )
    and (
      watering_interval_days_min is null
      or watering_interval_days_max is null
      or watering_interval_days_min <= watering_interval_days_max
    )
  ),
  constraint care_profiles_dryness_preference_check check (
    dryness_preference in (
      'dry_fully',
      'dry_mostly',
      'dry_top_half',
      'dry_top_inch',
      'lightly_moist',
      'evenly_moist',
      'special_medium',
      'unknown_conservative'
    )
  ),
  constraint care_profiles_match_confidence_check check (
    match_confidence in ('high', 'medium', 'low')
  ),
  constraint care_profiles_review_status_check check (
    review_status in ('draft', 'reviewed', 'needs_review')
  )
);

drop trigger if exists set_care_profiles_updated_at on public.care_profiles;

create trigger set_care_profiles_updated_at
before update on public.care_profiles
for each row
execute function public.set_updated_at();

create table if not exists public.care_profile_aliases (
  id uuid primary key default gen_random_uuid(),
  care_profile_id uuid not null references public.care_profiles (id) on delete cascade,
  alias text not null,
  normalized_alias text not null,
  alias_type text not null,
  priority integer not null default 100,
  created_at timestamptz not null default now(),
  constraint care_profile_aliases_alias_not_blank check (
    nullif(btrim(alias), '') is not null
  ),
  constraint care_profile_aliases_normalized_alias_not_blank check (
    nullif(btrim(normalized_alias), '') is not null
  ),
  constraint care_profile_aliases_alias_type_check check (
    alias_type in ('scientific', 'synonym', 'common', 'normalized_common', 'genus', 'group')
  ),
  constraint care_profile_aliases_priority_positive check (priority > 0),
  constraint care_profile_aliases_profile_alias_type_unique unique (
    care_profile_id,
    normalized_alias,
    alias_type
  )
);

create index if not exists care_profiles_profile_level_idx
on public.care_profiles (profile_level, profile_key);

create index if not exists care_profiles_review_status_idx
on public.care_profiles (review_status, match_confidence);

create index if not exists care_profile_aliases_normalized_alias_idx
on public.care_profile_aliases (normalized_alias, priority);

create index if not exists care_profile_aliases_profile_id_idx
on public.care_profile_aliases (care_profile_id);

alter table public.care_profiles enable row level security;
alter table public.care_profile_aliases enable row level security;

drop policy if exists "Authenticated users can view care profiles" on public.care_profiles;
create policy "Authenticated users can view care profiles"
on public.care_profiles
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can view care profile aliases" on public.care_profile_aliases;
create policy "Authenticated users can view care profile aliases"
on public.care_profile_aliases
for select
to authenticated
using (true);

insert into public.care_profiles (
  profile_key,
  profile_level,
  display_name,
  accepted_scientific_name,
  accepted_common_name,
  taxon_rank,
  watering_interval_days_default,
  watering_interval_days_min,
  watering_interval_days_max,
  dryness_preference,
  watering_guidance,
  beginner_note,
  match_confidence,
  review_status,
  source_summary
)
values
  (
    'species-dracaena-trifasciata',
    'species',
    'Snake plant',
    'Dracaena trifasciata',
    'Snake plant',
    'species',
    21,
    14,
    28,
    'dry_fully',
    'Check the soil and water only when it has dried through most or all of the pot.',
    'A conservative starter profile for drought-tolerant snake plants.',
    'medium',
    'draft',
    'Starter reference data for the AI Care Setup foundation; review before broad user-facing rollout.'
  ),
  (
    'species-epipremnum-aureum',
    'species',
    'Pothos',
    'Epipremnum aureum',
    'Pothos',
    'species',
    10,
    7,
    14,
    'dry_top_half',
    'Check the soil and water when the top half feels dry and the pot feels lighter.',
    'A forgiving trailing houseplant starter profile.',
    'medium',
    'draft',
    'Starter reference data for the AI Care Setup foundation; review before broad user-facing rollout.'
  ),
  (
    'species-pilea-peperomioides',
    'species',
    'Chinese money plant',
    'Pilea peperomioides',
    'Chinese money plant',
    'species',
    7,
    7,
    10,
    'dry_top_inch',
    'Check the soil and water when the top inch feels dry, then let extra water drain fully.',
    'Included to exercise ambiguity-safe common-name matching.',
    'medium',
    'draft',
    'Starter reference data for the AI Care Setup foundation; review before broad user-facing rollout.'
  ),
  (
    'genus-philodendron',
    'genus',
    'Philodendron',
    'Philodendron',
    'Philodendron',
    'genus',
    10,
    7,
    14,
    'dry_top_half',
    'Check the soil and water when the top half has dried; avoid leaving the pot soggy.',
    'Genus-level starter for common vining and self-heading philodendrons.',
    'medium',
    'draft',
    'Starter reference data for the AI Care Setup foundation; review before broad user-facing rollout.'
  ),
  (
    'care-group-succulent-like',
    'care_group',
    'Succulent-like houseplant',
    null,
    'Succulent-like houseplant',
    null,
    21,
    14,
    30,
    'dry_fully',
    'Start cautiously: check that the mix is fully dry before watering, then water thoroughly and drain.',
    'Care-group starter for thick-leaved drought-tolerant houseplants.',
    'low',
    'draft',
    'Starter reference data for the AI Care Setup foundation; review before broad user-facing rollout.'
  ),
  (
    'care-group-moderate-tropical',
    'care_group',
    'Moderate tropical houseplant',
    null,
    'Moderate tropical houseplant',
    null,
    7,
    7,
    14,
    'dry_top_inch',
    'Start by checking weekly and water when the top inch of soil feels dry.',
    'Care-group starter for common leafy tropical houseplants.',
    'low',
    'draft',
    'Starter reference data for the AI Care Setup foundation; review before broad user-facing rollout.'
  ),
  (
    'fallback-unknown-conservative',
    'fallback',
    'Unknown conservative starter',
    null,
    'Unknown houseplant',
    null,
    7,
    5,
    10,
    'unknown_conservative',
    'Start by checking every week and water only when the top inch feels dry; adjust after you learn how quickly it dries in your home.',
    'Fallback starter for plants without a safe identity or profile match.',
    'low',
    'draft',
    'Starter reference data for the AI Care Setup foundation; review before broad user-facing rollout.'
  )
on conflict (profile_key) do update
set
  profile_level = excluded.profile_level,
  display_name = excluded.display_name,
  accepted_scientific_name = excluded.accepted_scientific_name,
  accepted_common_name = excluded.accepted_common_name,
  taxon_rank = excluded.taxon_rank,
  watering_interval_days_default = excluded.watering_interval_days_default,
  watering_interval_days_min = excluded.watering_interval_days_min,
  watering_interval_days_max = excluded.watering_interval_days_max,
  dryness_preference = excluded.dryness_preference,
  watering_guidance = excluded.watering_guidance,
  beginner_note = excluded.beginner_note,
  match_confidence = excluded.match_confidence,
  review_status = excluded.review_status,
  source_summary = excluded.source_summary;

with alias_seed(profile_key, alias, normalized_alias, alias_type, priority) as (
  values
    ('species-dracaena-trifasciata', 'Dracaena trifasciata', 'dracaena trifasciata', 'scientific', 10),
    ('species-dracaena-trifasciata', 'Sansevieria trifasciata', 'sansevieria trifasciata', 'synonym', 20),
    ('species-dracaena-trifasciata', 'Snake plant', 'snake plant', 'common', 10),
    ('species-dracaena-trifasciata', 'Mother-in-law''s tongue', 'mother in laws tongue', 'common', 30),
    ('species-epipremnum-aureum', 'Epipremnum aureum', 'epipremnum aureum', 'scientific', 10),
    ('species-epipremnum-aureum', 'Pothos', 'pothos', 'common', 10),
    ('species-epipremnum-aureum', 'Devil''s ivy', 'devils ivy', 'common', 20),
    ('species-epipremnum-aureum', 'Money plant', 'money plant', 'common', 90),
    ('species-pilea-peperomioides', 'Pilea peperomioides', 'pilea peperomioides', 'scientific', 10),
    ('species-pilea-peperomioides', 'Chinese money plant', 'chinese money plant', 'common', 10),
    ('species-pilea-peperomioides', 'Money plant', 'money plant', 'common', 90),
    ('genus-philodendron', 'Philodendron', 'philodendron', 'genus', 10),
    ('care-group-succulent-like', 'Succulent', 'succulent', 'group', 10),
    ('care-group-succulent-like', 'Succulent-like', 'succulent like', 'group', 20),
    ('care-group-moderate-tropical', 'Tropical houseplant', 'tropical houseplant', 'group', 10),
    ('fallback-unknown-conservative', 'Unknown houseplant', 'unknown houseplant', 'group', 10)
)
insert into public.care_profile_aliases (
  care_profile_id,
  alias,
  normalized_alias,
  alias_type,
  priority
)
select
  care_profiles.id,
  alias_seed.alias,
  alias_seed.normalized_alias,
  alias_seed.alias_type,
  alias_seed.priority
from alias_seed
join public.care_profiles
  on care_profiles.profile_key = alias_seed.profile_key
on conflict (care_profile_id, normalized_alias, alias_type) do update
set
  alias = excluded.alias,
  priority = excluded.priority;
