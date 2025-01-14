begin;

select plan(6);

#include "supastate/sql/create.sql"

select fk_ok('public', 't1', 'user_id', 'auth', 'users', 'id');
select fk_ok('s1', 't1', 'user_id', 'auth', 'users', 'id');

#include "supastate/sql/drop.sql"

select has_column('auth', 'users', 'id', 'Column auth.users(id) should exist');
select has_schema('public');
select hasnt_table('public', 't1');
select hasnt_schema('s1');

select * from finish();

rollback;
