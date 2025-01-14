import {Supastate, RootTableFactory, CollectionTableFactory} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

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

const drop = new Supastate();

await writeSql([
    create.migrate({}),
    drop.migrate(create.entities),
]);
