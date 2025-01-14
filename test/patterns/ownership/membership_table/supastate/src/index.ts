import {Supastate, RootTableFactory, MembershipTableFactory} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const create = new Supastate();

const authSchema = create.addSchema({name: 'auth', external: true});
const s1Schema = create.addSchema({name: 's1'});

const rootTableFactory = new RootTableFactory(create);
const membershipTableFactory = new MembershipTableFactory(create);

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

const drop = new Supastate();

await writeSql([
    create.migrate({}),
    drop.migrate(create.entities),
]);
