create or replace function public.archive_plant_room(p_room_id uuid)
returns public.plant_rooms
language plpgsql
security invoker
as $$
declare
  archived_room public.plant_rooms;
begin
  update public.plant_rooms
  set archived_at = now()
  where id = p_room_id
    and user_id = auth.uid()
    and archived_at is null
  returning * into archived_room;

  if archived_room.id is null then
    raise exception 'room not found or already archived'
      using errcode = 'P0002';
  end if;

  update public.plants
  set room_id = null
  where user_id = auth.uid()
    and room_id = p_room_id;

  return archived_room;
end;
$$;
