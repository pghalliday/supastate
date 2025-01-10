begin;

#include "supastate/sql/supastate.sql"

select plan(3);

select policies_are('public', 'profiles', array['owner can do anything']);
select policy_roles_are('public', 'profiles', 'owner can do anything', array['postgres', 'authenticated']);
select policy_cmd_is('public', 'profiles', 'owner can do anything'::name, 'ALL');

select * from finish();

rollback;
