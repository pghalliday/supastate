begin;

#include "supastate/sql/supastate.sql"

select plan(2);

select fk_ok('public', 't1', 'user_id', 'auth', 'users', 'id');
select fk_ok('s1', 't1', 'user_id', 'auth', 'users', 'id');

select * from finish();

rollback;
