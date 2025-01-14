begin;

#include "../../../util/sql/rls.sql"

select plan(10);

#include "supastate/sql/create.sql"

select has_table('auth', 'users'::name);
select has_rls('auth', 'users');
select col_type_is('auth', 'users', 'id'::name, 'uuid');
select col_is_pk('auth', 'users', 'id', 'Column auth.users(id) should be a primary key');

select has_table('s1', 't1_root'::name);
select has_rls('s1', 't1_root');
select col_type_is('s1', 't1_root', 'id'::name, 'uuid');
select col_is_pk('s1', 't1_root', 'id', 'Column s1.t1_root(id) should be a primary key');

#include "supastate/sql/drop.sql"

select col_is_pk('auth', 'users', 'id', 'Column auth.users(id) should be a primary key');
select hasnt_schema('s1');

select * from finish();

rollback;
