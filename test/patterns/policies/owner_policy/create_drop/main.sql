begin;

select plan(10);

#include "../supastate/sql/create.sql"

select tu_has_rls('public', 'c_select'::name);
select policies_are('public', 'c_select', array ['Users should be able to select their own rows']);
select policy_roles_are('public', 'c_select', 'Users should be able to select their own rows', array ['authenticated']);
select policy_cmd_is('public', 'c_select', 'Users should be able to select their own rows'::name, 'SELECT');

select tu_has_rls('public', 'c_insert'::name);
select policies_are('public', 'c_insert', array ['Users should be able to add their own rows']);
select policy_roles_are('public', 'c_insert', 'Users should be able to add their own rows', array ['authenticated']);
select policy_cmd_is('public', 'c_insert', 'Users should be able to add their own rows'::name, 'INSERT');

#include "../supastate/sql/drop.sql"

select hasnt_table('public', 'c_select');
select hasnt_table('public', 'c_insert');

select * from finish();

rollback;
