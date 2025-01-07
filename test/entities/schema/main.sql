begin;

#include "supastate/sql/supastate.sql"

select plan(2);

select has_schema('auth');
select has_schema('s1');

select * from finish();

rollback;
