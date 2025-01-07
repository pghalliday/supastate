begin;

#include "supastate/sql/supastate.sql"

select plan(3);

select col_type_is('auth', 'users', 'id'::name, 'uuid');
select col_type_is('public', 't1', 'id'::name, 'uuid');
select col_type_is('s1', 't1', 'id'::name, 'uuid');

select * from finish();

rollback;
