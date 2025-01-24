import {Supastate} from "@pghalliday/supastate";
import {RootTableFactory} from "@pghalliday/supastate/patterns/ownership";
import {Supatest} from "@pghalliday/supatest";

const supatest = new Supatest();

const create = new Supastate();

const authSchema = create.addSchema({name: 'auth', external: true});
const s1Schema = create.addSchema({name: 's1'});

const rootTableFactory = new RootTableFactory(create);

const usersTable = rootTableFactory.addRootTable({
    name: 'users',
    schema: authSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    external: true,
});

const s1t1RootTable = rootTableFactory.addRootTable({
    name: 't1_root',
    schema: s1Schema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
});

supatest.setSupastate(create);

supatest.hasTable(usersTable.table);
supatest.hasRLS(usersTable.table);
supatest.colTypeIs(usersTable.primaryKeyColumn, 'uuid');
supatest.colIsPk(usersTable.primaryKeyColumn);

supatest.hasTable(s1t1RootTable.table);
supatest.hasRLS(s1t1RootTable.table);
supatest.colTypeIs(s1t1RootTable.primaryKeyColumn, 'uuid');
supatest.colIsPk(s1t1RootTable.primaryKeyColumn);

const drop = new Supastate();
supatest.setSupastate(drop);

supatest.colIsPk(usersTable.primaryKeyColumn);
supatest.hasntSchema(s1Schema);

await supatest.writeSQL();
