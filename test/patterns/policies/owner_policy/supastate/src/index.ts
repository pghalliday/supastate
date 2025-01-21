import {Supastate, RootTableFactory, CollectionTableFactory, OwnerPolicyFactory, createPolicyToRole} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const create = new Supastate();

const authenticatedRole = create.addRole({name: 'authenticated', external: true});

const authSchema = create.addSchema({name: 'auth', external: true});
const publicSchema = create.addSchema({name: 'public', external: true});

const rootTableFactory = new RootTableFactory(create);
const collectionTableFactory = new CollectionTableFactory(create);
const ownerPolicyFactory = new OwnerPolicyFactory(create);

const usersTable = rootTableFactory.addRootTable({
    name: 'users',
    schema: authSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    external: true,
});

const cSelectTable = collectionTableFactory.addCollectionTable({
    name: 'c_select',
    schema: publicSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    foreignKeyColumnName: 'user_id',
    ownerTable: usersTable,
});
const cSelectPolicy = ownerPolicyFactory.addOwnerPolicy({
    name: 'Users should be able to select their own rows',
    table: cSelectTable.table,
    for: 'SELECT',
    to: [createPolicyToRole(authenticatedRole)],
});

const cInsertTable = collectionTableFactory.addCollectionTable({
    name: 'c_insert',
    schema: publicSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    foreignKeyColumnName: 'user_id',
    ownerTable: usersTable,
});
const cInsertPolicy = ownerPolicyFactory.addOwnerPolicy({
    name: 'Users should be able to add their own rows',
    table: cInsertTable.table,
    for: 'INSERT',
    to: [createPolicyToRole(authenticatedRole)],
});

const drop = new Supastate();

await writeSql([
    create.migrate({}),
    drop.migrate(create.entities),
]);
