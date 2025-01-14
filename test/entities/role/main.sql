begin;

select plan(4);

#include "supastate/sql/create.sql"

select has_role('authenticated');
select has_role('r1');

#include "supastate/sql/drop.sql"

select has_role('authenticated');
select hasnt_role('r1');

select * from finish();

rollback;
