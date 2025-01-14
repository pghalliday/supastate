begin;

select plan(6);

#include "supastate/sql/create.sql"

select has_table('s1', 't1_info'::name);
select has_rls('s1', 't1_info');
select col_is_pk('s1', 't1_info', 'id', 'Column s1.t1_info(id) should be a primary key');
select fk_ok('s1', 't1_info', 'id', 'auth', 'users', 'id');

#include "supastate/sql/drop.sql"

select col_is_pk('auth', 'users', 'id', 'Column auth.users(id) should be a primary key');
select hasnt_schema('s1');

select * from finish();

rollback;
