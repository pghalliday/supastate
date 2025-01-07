begin;

#include "supastate/sql/supastate.sql"
#include "../../util/rls.sql"

select plan(3);

select has_rls('auth', 'users'::name);
select has_rls('public', 't1'::name);
select has_rls('s1', 't1'::name);

select * from finish();

rollback;
