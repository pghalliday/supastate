begin;

select plan(5);

select tests.create_supabase_user('user_1');
select tests.create_supabase_user('user_2');
select tests.create_supabase_user('user_3');

#include "../supastate/sql/create.sql"

insert into c_select
    (id, user_id)
values
    (tu_uuid('c_1_1'), tests.get_supabase_uid('user_1')),
    (tu_uuid('c_1_2'), tests.get_supabase_uid('user_1')),
    (tu_uuid('c_1_3'), tests.get_supabase_uid('user_1')),
    (tu_uuid('c_2_1'), tests.get_supabase_uid('user_2')),
    (tu_uuid('c_2_2'), tests.get_supabase_uid('user_2')),
    (tu_uuid('c_3_1'), tests.get_supabase_uid('user_3'));

select tests.clear_authentication();

select is_empty(
    'select tu_uuid(id) from c_select',
    'Unauthenticated users should not be able to select any rows from c_select'
);

select throws_ok(
    $$
    insert into c_insert (id, owner_id) values (
    tu_uuid('c_1_1'),
    tests.get_supabase_uid('user_1')
    )
    $$,
    'new row violates row-level security policy for table "c_insert"',
    'Unauthenticated users should not be able to insert any rows into c_insert'
);

select tests.authenticate_as('user_1');

select set_eq(
    'select tu_uuid(id) from c_select',
    array[
    'c_1_1',
    'c_1_2',
    'c_1_3'
    ],
    'User 1 should only be able to select their own rows from c_select'
);

select lives_ok(
    $$
    insert into c_insert (id, owner_id) values (
    tu_uuid('c_1_1'),
    tests.get_supabase_uid('user_1')
    )
    $$,
    'User 1 should be able to insert rows for themselves into c_insert'
);

select throws_ok(
    $$
    insert into c_insert (id, owner_id) values (
    tu_uuid('c_2_1'),
    tests.get_supabase_uid('user_2')
    )
    $$,
    'new row violates row-level security policy for table "c_insert"',
    'User 1 should not be able to insert rows for other users into c_insert'
);

select *
from finish();

rollback;
