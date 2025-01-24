import {Supastate} from "@pghalliday/supastate";
import {createPolicyToRole} from "@pghalliday/supastate/util";
import {CollectionTableFactory, RootTableFactory} from "@pghalliday/supastate/patterns/ownership";
import {UserPolicyFactory} from "@pghalliday/supastate/patterns/policies";
import "@pghalliday/supastate/entities";

export const create = new Supastate();

export const authenticatedRole = create.addRole({name: 'authenticated', external: true});

export const authSchema = create.addSchema({name: 'auth', external: true});
export const publicSchema = create.addSchema({name: 'public', external: true});

export const rootTableFactory = new RootTableFactory(create);
export const collectionTableFactory = new CollectionTableFactory(create);
export const userPolicyFactory = new UserPolicyFactory(create);

export const usersTable = rootTableFactory.addRootTable({
    name: 'users',
    schema: authSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    external: true,
});

export const cSelectTable = collectionTableFactory.addCollectionTable({
    name: 'c_select',
    schema: publicSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    foreignKeyColumnName: 'user_id',
    ownerTable: usersTable,
});
export const cSelectColumn = create.addColumn({
    name: 'text_value',
    table: cSelectTable.table,
    type: "text default 'foo'",
});
export const cSelectPolicy = userPolicyFactory.addUserPolicy({
    name: 'Authenticated should be able to select',
    table: cSelectTable.table,
    for: 'SELECT',
    to: [createPolicyToRole(authenticatedRole)],
});

export const cInsertTable = collectionTableFactory.addCollectionTable({
    name: 'c_insert',
    schema: publicSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    foreignKeyColumnName: 'user_id',
    ownerTable: usersTable,
});
export const cInsertColumn = create.addColumn({
    name: 'text_value',
    table: cInsertTable.table,
    type: "text default 'foo'",
});
export const cInsertPolicy = userPolicyFactory.addUserPolicy({
    name: 'Authenticated should be able to insert',
    table: cInsertTable.table,
    for: 'INSERT',
    to: [createPolicyToRole(authenticatedRole)],
});

export const cUpdateTable = collectionTableFactory.addCollectionTable({
    name: 'c_update',
    schema: publicSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    foreignKeyColumnName: 'user_id',
    ownerTable: usersTable,
});
export const cUpdateColumn = create.addColumn({
    name: 'text_value',
    table: cUpdateTable.table,
    type: "text default 'foo'",
});
export const cUpdatePolicy = userPolicyFactory.addUserPolicy({
    name: 'Authenticated should be able to update',
    table: cUpdateTable.table,
    for: 'UPDATE',
    to: [createPolicyToRole(authenticatedRole)],
});

export const cDeleteTable = collectionTableFactory.addCollectionTable({
    name: 'c_delete',
    schema: publicSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    foreignKeyColumnName: 'user_id',
    ownerTable: usersTable,
});
export const cDeleteColumn = create.addColumn({
    name: 'text_value',
    table: cDeleteTable.table,
    type: "text default 'foo'",
});
export const cDeletePolicy = userPolicyFactory.addUserPolicy({
    name: 'Authenticated should be able to delete',
    table: cDeleteTable.table,
    for: 'DELETE',
    to: [createPolicyToRole(authenticatedRole)],
});

export const cAllTable = collectionTableFactory.addCollectionTable({
    name: 'c_all',
    schema: publicSchema,
    primaryKeyColumnName: 'id',
    primaryKeyColumnType: 'uuid',
    foreignKeyColumnName: 'user_id',
    ownerTable: usersTable,
});
export const cAllColumn = create.addColumn({
    name: 'text_value',
    table: cAllTable.table,
    type: "text default 'foo'",
});
export const cAllPolicy = userPolicyFactory.addUserPolicy({
    name: 'Authenticated should be able to do all',
    table: cAllTable.table,
    for: 'ALL',
    to: [createPolicyToRole(authenticatedRole)],
});
