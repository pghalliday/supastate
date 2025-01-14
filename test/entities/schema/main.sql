begin;

select plan(4);

#include "supastate/sql/create.sql"

select has_schema('auth');
select has_schema('s1');

#include "supastate/sql/drop.sql"

select has_schema('auth');
select hasnt_schema('s1');

select * from finish();

rollback;
