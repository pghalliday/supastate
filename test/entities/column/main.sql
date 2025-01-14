begin;

select plan(7);

#include "supastate/sql/create.sql"

select col_type_is('auth', 'users', 'id'::name, 'uuid');
select col_type_is('public', 't1', 'id'::name, 'uuid');
select col_type_is('s1', 't1', 'id'::name, 'uuid');

#include "supastate/sql/drop.sql"

select has_column('auth', 'users', 'id', 'Column auth.users(id) should exist');
select has_schema('public');
select hasnt_table('public', 't1');
select hasnt_schema('s1');

select * from finish();

rollback;
