begin;

select plan(25);

#include "../supastate/sql/create.sql"

select tu_has_rls('public', 'c_select'::name);
select policies_are('public', 'c_select', array ['Authenticated should be able to select']);
select policy_roles_are('public', 'c_select', 'Authenticated should be able to select', array ['authenticated']);
select policy_cmd_is('public', 'c_select', 'Authenticated should be able to select'::name, 'SELECT');

select tu_has_rls('public', 'c_insert'::name);
select policies_are('public', 'c_insert', array ['Authenticated should be able to insert']);
select policy_roles_are('public', 'c_insert', 'Authenticated should be able to insert', array ['authenticated']);
select policy_cmd_is('public', 'c_insert', 'Authenticated should be able to insert'::name, 'INSERT');

select tu_has_rls('public', 'c_update'::name);
select policies_are('public', 'c_update', array ['Authenticated should be able to update']);
select policy_roles_are('public', 'c_update', 'Authenticated should be able to update', array ['authenticated']);
select policy_cmd_is('public', 'c_update', 'Authenticated should be able to update'::name, 'UPDATE');

select tu_has_rls('public', 'c_delete'::name);
select policies_are('public', 'c_delete', array ['Authenticated should be able to delete']);
select policy_roles_are('public', 'c_delete', 'Authenticated should be able to delete', array ['authenticated']);
select policy_cmd_is('public', 'c_delete', 'Authenticated should be able to delete'::name, 'DELETE');

select tu_has_rls('public', 'c_all'::name);
select policies_are('public', 'c_all', array ['Authenticated should be able to do all']);
select policy_roles_are('public', 'c_all', 'Authenticated should be able to do all', array ['authenticated']);
select policy_cmd_is('public', 'c_all', 'Authenticated should be able to do all'::name, 'ALL');

#include "../supastate/sql/drop.sql"

select hasnt_table('public', 'c_select');
select hasnt_table('public', 'c_insert');
select hasnt_table('public', 'c_update');
select hasnt_table('public', 'c_delete');
select hasnt_table('public', 'c_all');

select * from finish();

rollback;
