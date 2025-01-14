begin;

select plan(1);

#include "../supastate/sql/create.sql"

select todo_start();
select fail('Test the user policies');
select todo_end();

select *
from finish();

rollback;
