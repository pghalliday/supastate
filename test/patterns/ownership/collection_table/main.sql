begin;

#include "supastate/sql/supastate.sql"
#include "../../../util/rls.sql"

select plan(5);

select has_table('s1', 't1_col'::name);
select has_rls('s1', 't1_col');
select col_type_is('s1', 't1_col', 'id'::name, 'uuid');
select col_is_pk('s1', 't1_col', 'id', 'Column s1.t1_col(id) should be a primary key');
select fk_ok('s1', 't1_col', 'user_id', 'auth', 'users', 'id');

select * from finish();

rollback;
