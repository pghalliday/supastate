#pragma once

create table tu_uuids (
    id uuid default gen_random_uuid() primary key,
    ref text unique not null
);

create function tu_uuid(p_ref text) returns uuid as $_api_$
declare
  v_id uuid;
begin
  select id into v_id from tu_uuids where ref = p_ref;
  if v_id is null then
    insert into tu_uuids(ref) values(p_ref) returning id into v_id;
  end if;
  return v_id;
end;
$_api_$ language plpgsql;

create function tu_uuid(p_id uuid) returns text as $_api_$
declare
    v_ref text;
begin
    select ref into v_ref from tu_uuids where id = p_id;
    assert v_ref is not null, format('Unknown id: %s', p_id);
    return v_ref;
end;
$_api_$ language plpgsql;
