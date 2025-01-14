import {Supastate, RootTableFactory, CollectionTableFactory, UserPolicyFactory, createPolicyToRole} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const create = new Supastate();

const authenticatedRole = create.addRole({name: 'authenticated', external: true});

const authSchema = create.addSchema({name: 'auth', external: true});
const publicSchema = create.addSchema({name: 'public', external: true});

const rootTableFactory = new RootTableFactory(create);
const collectionTableFactory = new CollectionTableFactory(create);
const userPolicyFactory = new UserPolicyFactory(create);

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
const cSelectColumn = create.addColumn({
    name: 'text_value',
    table: cSelectTable.table,
    type: "text default 'foo'",
});
const cSelectPolicy = userPolicyFactory.addUserPolicy({
    name: 'Authenticated should be able to select',
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
const cInsertColumn = create.addColumn({
    name: 'text_value',
    table: cInsertTable.table,
    type: "text default 'foo'",
});
const cInsertPolicy = userPolicyFactory.addUserPolicy({
    name: 'Authenticated should be able to insert',
    table: cInsertTable.table,
    for: 'INSERT',
    to: [createPolicyToRole(authenticatedRole)],
});

const cUpdateTable = collectionTableFactory.addCollectionTable({
    name: 'c_update',
    schema: publicSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    foreignKeyColumnName: 'user_id',
    ownerTable: usersTable,
});
const cUpdateColumn = create.addColumn({
    name: 'text_value',
    table: cUpdateTable.table,
    type: "text default 'foo'",
});
const cUpdatePolicy = userPolicyFactory.addUserPolicy({
    name: 'Authenticated should be able to update',
    table: cUpdateTable.table,
    for: 'UPDATE',
    to: [createPolicyToRole(authenticatedRole)],
});

const cDeleteTable = collectionTableFactory.addCollectionTable({
    name: 'c_delete',
    schema: publicSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    foreignKeyColumnName: 'user_id',
    ownerTable: usersTable,
});
const cDeleteColumn = create.addColumn({
    name: 'text_value',
    table: cDeleteTable.table,
    type: "text default 'foo'",
});
const cDeletePolicy = userPolicyFactory.addUserPolicy({
    name: 'Authenticated should be able to delete',
    table: cDeleteTable.table,
    for: 'DELETE',
    to: [createPolicyToRole(authenticatedRole)],
});

const cAllTable = collectionTableFactory.addCollectionTable({
    name: 'c_all',
    schema: publicSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    foreignKeyColumnName: 'user_id',
    ownerTable: usersTable,
});
const cAllColumn = create.addColumn({
    name: 'text_value',
    table: cAllTable.table,
    type: "text default 'foo'",
});
const cAllPolicy = userPolicyFactory.addUserPolicy({
    name: 'Authenticated should be able to do all',
    table: cAllTable.table,
    for: 'ALL',
    to: [createPolicyToRole(authenticatedRole)],
});

const drop = new Supastate();

await writeSql([
    create.migrate({}),
    drop.migrate(create.entities),
]);
