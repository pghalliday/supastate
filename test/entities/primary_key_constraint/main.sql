begin;

select plan(7);

#include "supastate/sql/create.sql"

select col_is_pk('auth', 'users', 'id', 'Column auth.users(id) should be a primary key');
select col_is_pk('public', 't1', 'id', 'Column public.t1(id) should be a primary key');
select col_is_pk('s1', 't1', 'id', 'Column s1.t1(id) should be a primary key');

#include "supastate/sql/drop.sql"

select col_is_pk('auth', 'users', 'id', 'Column auth.users(id) should be a primary key');
select has_schema('public');
select hasnt_table('public', 't1');
select hasnt_schema('s1');

select * from finish();

rollback;
