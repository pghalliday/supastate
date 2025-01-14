#pragma once

create function tu_get_supabase_user_identifier(p_id uuid) returns text as $_api_$
    select raw_user_meta_data ->> 'test_identifier'
    from auth.users
    where id = p_id
$_api_$ language sql;
