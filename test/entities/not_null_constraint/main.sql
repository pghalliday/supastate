begin;

select plan(7);

#include "supastate/sql/create.sql"

select col_not_null('auth', 'users', 'id'::name);
select col_not_null('public', 't1', 'id'::name);
select col_not_null('s1', 't1', 'id'::name);

#include "supastate/sql/drop.sql"

select has_column('auth', 'users', 'id', 'Column auth.users(id) should exist');
select has_schema('public');
select hasnt_table('public', 't1');
select hasnt_schema('s1');

select * from finish();

rollback;
