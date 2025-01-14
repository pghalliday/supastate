begin;

select plan(7);

#include "supastate/sql/create.sql"

select has_rls('auth', 'users'::name);
select has_rls('public', 't1'::name);
select has_rls('s1', 't1'::name);

#include "supastate/sql/drop.sql"

select has_rls('auth', 'users'::name);
select has_schema('public');
select hasnt_table('public', 't1');
select hasnt_schema('s1');

select * from finish();

rollback;
