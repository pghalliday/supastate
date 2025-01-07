begin;

#include "supastate/sql/supastate.sql"

select plan(3);

select col_is_pk('auth', 'users', 'id', 'Column auth.users(id) should be a primary key');
select col_is_pk('public', 't1', 'id', 'Column public.t1(id) should be a primary key');
select col_is_pk('s1', 't1', 'id', 'Column s1.t1(id) should be a primary key');

select * from finish();

rollback;
