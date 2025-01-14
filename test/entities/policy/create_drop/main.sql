begin;

#include "../../../util/sql/rls.sql"

select plan(7);

#include "../supastate/sql/create.sql"

select has_rls('public', 'profiles'::name);
select policies_are('public', 'profiles', array ['owner can do anything']);
select policy_roles_are('public', 'profiles', 'owner can do anything', array ['postgres', 'authenticated']);
select policy_cmd_is('public', 'profiles', 'owner can do anything'::name, 'ALL');

#include "../supastate/sql/drop.sql"

select has_column('auth', 'users', 'id', 'Column auth.users(id) should exist');
select has_schema('public');
select hasnt_table('public', 'profiles');

select *
from finish();

rollback;
