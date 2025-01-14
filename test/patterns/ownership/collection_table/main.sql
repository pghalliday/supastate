begin;

select plan(7);

#include "supastate/sql/create.sql"

select has_table('s1', 't1_col'::name);
select has_rls('s1', 't1_col');
select col_type_is('s1', 't1_col', 'id'::name, 'uuid');
select col_is_pk('s1', 't1_col', 'id', 'Column s1.t1_col(id) should be a primary key');
select fk_ok('s1', 't1_col', 'user_id', 'auth', 'users', 'id');

#include "supastate/sql/drop.sql"

select col_is_pk('auth', 'users', 'id', 'Column auth.users(id) should be a primary key');
select hasnt_schema('s1');

select * from finish();

rollback;
