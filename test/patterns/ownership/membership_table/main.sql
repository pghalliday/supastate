begin;

#include "../../../util/sql/rls.sql"

select plan(8);

#include "supastate/sql/create.sql"

select has_table('s1', 't2_mem'::name);
select has_rls('s1', 't2_mem');
select col_type_is('s1', 't2_mem', 'id'::name, 'uuid');
select col_is_pk('s1', 't2_mem', 'id', 'Column s1.t2_mem(id) should be a primary key');
select fk_ok('s1', 't2_mem', 'member_id', 'auth', 'users', 'id');
select fk_ok('s1', 't2_mem', 'group_id', 's1', 't1_root', 'id');

#include "supastate/sql/drop.sql"

select col_is_pk('auth', 'users', 'id', 'Column auth.users(id) should be a primary key');
select hasnt_schema('s1');

select * from finish();

rollback;
