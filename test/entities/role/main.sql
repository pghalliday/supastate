begin;

#include "supastate/sql/supastate.sql"

select plan(2);

select has_role('authenticated');
select has_role('r1');

select * from finish();

rollback;
