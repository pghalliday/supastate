import {Supastate} from "@pghalliday/supastate";
import {RootTableFactory, MembershipTableFactory} from "@pghalliday/supastate/patterns/ownership";
import {Supatest} from "@pghalliday/supatest";

const supatest = new Supatest();

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

const s1t1MemTable = membershipTableFactory.addMembershipTable({
    name: 't2_mem',
    schema: s1Schema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    memberColumnName: 'member_id',
    memberTable: usersTable,
    groupColumnName: 'group_id',
    groupTable: s1T1Root,
});

supatest.setSupastate(create);

supatest.hasTable(s1t1MemTable.table);
supatest.hasRLS(s1t1MemTable.table);
supatest.colTypeIs(s1t1MemTable.primaryKeyColumn, 'uuid');
supatest.colIsPk(s1t1MemTable.primaryKeyColumn);
supatest.fkOk(s1t1MemTable.memberForeignKeyConstraint);
supatest.fkOk(s1t1MemTable.groupForeignKeyConstraint);

const drop = new Supastate();
supatest.setSupastate(drop);

supatest.colIsPk(usersTable.primaryKeyColumn);
supatest.hasntSchema(s1Schema);

await supatest.writeSQL();
