begin;

select plan(28);

select tests.create_supabase_user('user_1');
select tests.create_supabase_user('user_2');
select tests.create_supabase_user('user_3');
select tests.create_supabase_user('user_4');

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

insert into c_insert
    (id, user_id)
values
    (tu_uuid('c_1_1'), tests.get_supabase_uid('user_1')),
    (tu_uuid('c_1_2'), tests.get_supabase_uid('user_1')),
    (tu_uuid('c_1_3'), tests.get_supabase_uid('user_1')),
    (tu_uuid('c_2_1'), tests.get_supabase_uid('user_2')),
    (tu_uuid('c_2_2'), tests.get_supabase_uid('user_2')),
    (tu_uuid('c_3_1'), tests.get_supabase_uid('user_3'));

insert into c_update
    (id, user_id)
values
    (tu_uuid('c_1_1'), tests.get_supabase_uid('user_1')),
    (tu_uuid('c_1_2'), tests.get_supabase_uid('user_1')),
    (tu_uuid('c_1_3'), tests.get_supabase_uid('user_1')),
    (tu_uuid('c_2_1'), tests.get_supabase_uid('user_2')),
    (tu_uuid('c_2_2'), tests.get_supabase_uid('user_2')),
    (tu_uuid('c_3_1'), tests.get_supabase_uid('user_3'));

insert into c_delete
    (id, user_id)
values
    (tu_uuid('c_1_1'), tests.get_supabase_uid('user_1')),
    (tu_uuid('c_1_2'), tests.get_supabase_uid('user_1')),
    (tu_uuid('c_1_3'), tests.get_supabase_uid('user_1')),
    (tu_uuid('c_2_1'), tests.get_supabase_uid('user_2')),
    (tu_uuid('c_2_2'), tests.get_supabase_uid('user_2')),
    (tu_uuid('c_3_1'), tests.get_supabase_uid('user_3'));

insert into c_all
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
    insert into c_insert
    (id, user_id)
    values
    (tu_uuid('c_4_1'), tests.get_supabase_uid('user_4'))
    $$,
    'new row violates row-level security policy for table "c_insert"',
    'Unauthenticated users should not be able to insert into c_insert'
);

select is_empty(
    $$
    update c_update set text_value = 'bar' returning 0
    $$,
    'Unauthenticated users should not be able to update rows in c_update'
);

select is_empty(
    $$
    delete from c_delete where id = tu_uuid('c_1_1') returning 0
    $$,
    'Unauthenticated users should not be able to delete any rows from c_delete'
);

select is_empty(
    'select tu_uuid(id) from c_all',
    'Unauthenticated users should not be able to select any rows from c_all'
);

select throws_ok(
    $$
    insert into c_all
    (id, user_id)
    values
    (tu_uuid('c_4_1'), tests.get_supabase_uid('user_4'))
    $$,
    'new row violates row-level security policy for table "c_all"',
    'Unauthenticated users should not be able to insert into c_all'
);

select is_empty(
    $$
    update c_all set text_value = 'bar' returning 0
    $$,
    'Unauthenticated users should not be able to update rows in c_all'
);

select is_empty(
    $$
    delete from c_all where id = tu_uuid('c_1_1') returning 0
    $$,
    'Unauthenticated users should not be able to delete any rows from c_all'
);

select tests.authenticate_as('user_4');

select set_eq(
    'select tu_uuid(id) from c_select',
    array[
    'c_1_1',
    'c_1_2',
    'c_1_3',
    'c_2_1',
    'c_2_2',
    'c_3_1'
    ],
    'Authenticated users should be able to select all rows from c_select'
);

select throws_ok(
    $$
    insert into c_select
    (id, user_id)
    values
    (tu_uuid('c_4_1'), tests.get_supabase_uid('user_4'))
    $$,
    'new row violates row-level security policy for table "c_select"',
    'Authenticated users should not be able to insert into c_select'
);

select is_empty(
    $$
    update c_select set text_value = 'bar' returning 0
    $$,
    'Authenticated users should not be able to update rows in c_select'
);

select is_empty(
    $$
    delete from c_select where id = tu_uuid('c_1_1') returning 0
    $$,
    'Authenticated users should not be able to delete any rows from c_select'
);

select is_empty(
    'select tu_uuid(id) from c_insert',
    'Authenticated users should not be able to select from c_insert'
);

select lives_ok(
    $$
    insert into c_insert
    (id, user_id)
    values
    (tu_uuid('c_4_1'), tests.get_supabase_uid('user_4'))
    $$,
    'Authenticated users should be able to insert into c_insert'
);

select is_empty(
    $$
    update c_insert set text_value = 'bar' returning 0
    $$,
    'Authenticated users should not be able to update rows in c_insert'
);

select is_empty(
    $$
    delete from c_insert where id = tu_uuid('c_1_1') returning 0
    $$,
    'Authenticated users should not be able to delete any rows from c_insert'
);

select is_empty(
    'select tu_uuid(id) from c_delete',
    'Authenticated users should not be able to select from c_delete'
);

select throws_ok(
    $$
    insert into c_delete
    (id, user_id)
    values
    (tu_uuid('c_4_1'), tests.get_supabase_uid('user_4'))
    $$,
    'new row violates row-level security policy for table "c_delete"',
    'Authenticated users should not be able to insert into c_delete'
);

select is_empty(
    $$
    update c_delete set text_value = 'bar' returning 0
    $$,
    'Authenticated users should not be able to update rows in c_delete'
);

select isnt_empty(
    $$
    delete from c_delete returning 0
    $$,
    'Authenticated users should be able to delete from c_delete'
);

select is_empty(
    'select tu_uuid(id) from c_update',
    'Authenticated users should not be able to select from c_update'
);

select throws_ok(
    $$
    insert into c_update
    (id, user_id)
    values
    (tu_uuid('c_4_1'), tests.get_supabase_uid('user_4'))
    $$,
    'new row violates row-level security policy for table "c_update"',
    'Authenticated users should not be able to insert into c_update'
);

select isnt_empty(
    $$
    update c_update set text_value = 'bar' returning 0
    $$,
    'Authenticated users should be able to update rows in c_update'
);

select is_empty(
    $$
    delete from c_update returning 0
    $$,
    'Authenticated users should not be able to delete from c_update'
);

select set_eq(
    'select tu_uuid(id) from c_all',
    array[
    'c_1_1',
    'c_1_2',
    'c_1_3',
    'c_2_1',
    'c_2_2',
    'c_3_1'
    ],
    'Authenticated users should be able to select all rows from c_all'
);

select lives_ok(
    $$
    insert into c_all
    (id, user_id)
    values
    (tu_uuid('c_4_1'), tests.get_supabase_uid('user_4'))
    $$,
    'Authenticated users should be able to insert into c_all'
);

select isnt_empty(
    $$
    update c_all set text_value = 'bar' returning 0
    $$,
    'Authenticated users should be able to update rows in c_all'
);

select isnt_empty(
    $$
    delete from c_all where id = tu_uuid('c_1_1') returning 0
    $$,
    'Authenticated users should be able to delete from c_all'
);

select *
from finish();

rollback;
