begin;

create extension "basejump-supabase_test_helpers";
#include "../../../util/sql/rls.sql"

select plan(1);

#include "../supastate/sql/create.sql"

select tests.create_supabase_user('user_1');
select tests.create_supabase_user('user_2');
select tests.create_supabase_user('user_3');
select tests.create_supabase_user('user_4');

select todo_start();
select fail('Test the actual policy');
select todo_end();

select * from finish();

rollback;
