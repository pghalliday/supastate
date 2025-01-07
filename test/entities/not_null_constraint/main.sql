begin;

#include "supastate/sql/supastate.sql"

select plan(3);

select col_not_null('auth', 'users', 'id'::name);
select col_not_null('public', 't1', 'id'::name);
select col_not_null('s1', 't1', 'id'::name);

select * from finish();

rollback;
