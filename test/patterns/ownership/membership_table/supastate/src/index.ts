import {Supastate, RootTableFactory, MembershipTableFactory} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const supastate = new Supastate();

const authSchema = supastate.addSchema({name: 'auth', external: true});
const s1Schema = supastate.addSchema({name: 's1'});

const rootTableFactory = new RootTableFactory(supastate);
const membershipTableFactory = new MembershipTableFactory(supastate);

const usersTable = rootTableFactory.addRootTable({
    name: 'users',
    schema: authSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    external: true,
});

const s1T1Root = rootTableFactory.addRootTable({
    name: 't1_root',
    schema: s1Schema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
});

const s1t1ColTable = membershipTableFactory.addMembershipTable({
    name: 't2_mem',
    schema: s1Schema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    memberColumnName: 'member_id',
    memberTable: usersTable,
    groupColumnName: 'group_id',
    groupTable: s1T1Root,
});

await writeSql({
    'sql/supastate.sql': supastate.migrate({}),
});
