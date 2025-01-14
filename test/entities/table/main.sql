begin;

select plan(6);

#include "supastate/sql/create.sql"

select has_table('auth', 'users'::name);
select has_table('public', 't1'::name);
select has_table('s1', 't1'::name);

#include "supastate/sql/drop.sql"

select has_table('auth', 'users'::name);
select hasnt_table('public', 't1'::name);
select hasnt_schema('s1');

select * from finish();

rollback;
