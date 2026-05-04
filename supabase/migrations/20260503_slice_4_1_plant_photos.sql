alter table public.plants
add column if not exists primary_photo_path text,
add column if not exists primary_photo_uploaded_at timestamptz;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'plant-photos',
  'plant-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can view their own plant photos" on storage.objects;
create policy "Users can view their own plant photos"
on storage.objects
for select
using (
  bucket_id = 'plant-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.plants
    where plants.user_id = auth.uid()
      and plants.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "Users can upload photos for their own plants" on storage.objects;
create policy "Users can upload photos for their own plants"
on storage.objects
for insert
with check (
  bucket_id = 'plant-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.plants
    where plants.user_id = auth.uid()
      and plants.id::text = (storage.foldername(name))[2]
      and plants.archived_at is null
  )
);

drop policy if exists "Users can replace photos for their own plants" on storage.objects;
create policy "Users can replace photos for their own plants"
on storage.objects
for update
using (
  bucket_id = 'plant-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.plants
    where plants.user_id = auth.uid()
      and plants.id::text = (storage.foldername(name))[2]
      and plants.archived_at is null
  )
)
with check (
  bucket_id = 'plant-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.plants
    where plants.user_id = auth.uid()
      and plants.id::text = (storage.foldername(name))[2]
      and plants.archived_at is null
  )
);

drop policy if exists "Users can remove photos for their own plants" on storage.objects;
create policy "Users can remove photos for their own plants"
on storage.objects
for delete
using (
  bucket_id = 'plant-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.plants
    where plants.user_id = auth.uid()
      and plants.id::text = (storage.foldername(name))[2]
  )
);
