begin;

#include "supastate/sql/supastate.sql"

select plan(3);

select has_table('auth', 'users'::name);
select has_table('public', 't1'::name);
select has_table('s1', 't1'::name);

select * from finish();

rollback;
