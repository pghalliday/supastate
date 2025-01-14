begin;

create
    extension if not exists "basejump-supabase_test_helpers";

select plan(3);

#include "../supastate/sql/create.sql"

select tests.create_supabase_user('user_1');
select tests.create_supabase_user('user_2');
select tests.clear_authentication();

select throws_ok(
    $$
        insert into profiles
            (user_id)
        values
            (tests.get_supabase_uid('user_1'))
    $$,
    'new row violates row-level security policy for table "profiles"',
    'Unauthenticated users should not be able to insert into profiles'
);

select tests.authenticate_as('user_1');

select throws_ok(
    $$
        insert into profiles
            (user_id)
        values
            (tests.get_supabase_uid('user_2'))
    $$,
    'new row violates row-level security policy for table "profiles"',
    'Users should not be able to insert into profiles for other users'
);

select lives_ok(
    $$
        insert into profiles
            (user_id)
        values
            (tests.get_supabase_uid('user_1'))
    $$,
    'Authenticated users should be able to insert into profiles for themselves'
);

select *
from finish();

rollback;
