import {Supastate} from "@pghalliday/supastate";
import {RootTableFactory, CollectionTableFactory} from "@pghalliday/supastate/patterns/ownership";
import {Supatest} from "@pghalliday/supatest";

const supatest = new Supatest();

const create = new Supastate();

const authSchema = create.addSchema({name: 'auth', external: true});
const s1Schema = create.addSchema({name: 's1'});

const rootTableFactory = new RootTableFactory(create);
const collectionTableFactory = new CollectionTableFactory(create);

const usersTable = rootTableFactory.addRootTable({
    name: 'users',
    schema: authSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    external: true,
});

const s1t1ColTable = collectionTableFactory.addCollectionTable({
    name: 't1_col',
    schema: s1Schema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    foreignKeyColumnName: 'user_id',
    ownerTable: usersTable,
});

supatest.setSupastate(create);

supatest.hasTable(s1t1ColTable.table);
supatest.hasRLS(s1t1ColTable.table);
supatest.colTypeIs(s1t1ColTable.primaryKeyColumn, 'uuid');
supatest.colIsPk(s1t1ColTable.primaryKeyColumn);
supatest.fkOk(s1t1ColTable.foreignKeyConstraint);

const drop = new Supastate();
supatest.setSupastate(drop);

supatest.colIsPk(usersTable.primaryKeyColumn);
supatest.hasntSchema(s1Schema);

await supatest.writeSQL();
