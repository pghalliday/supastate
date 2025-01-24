import {Supastate} from "@pghalliday/supastate";
import {RootTableFactory, CollectionTableFactory} from "@pghalliday/supastate/patterns/ownership";
import {OwnerPolicyFactory} from "@pghalliday/supastate/patterns/policies";
import {createPolicyToRole} from "@pghalliday/supastate/util";

export const create = new Supastate();

export const authenticatedRole = create.addRole({name: 'authenticated', external: true});

export const authSchema = create.addSchema({name: 'auth', external: true});
export const publicSchema = create.addSchema({name: 'public', external: true});

export const rootTableFactory = new RootTableFactory(create);
export const collectionTableFactory = new CollectionTableFactory(create);
export const ownerPolicyFactory = new OwnerPolicyFactory(create);

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
export const cSelectPolicy = ownerPolicyFactory.addOwnerPolicy({
    name: 'Users should be able to select their own rows',
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
export const cInsertPolicy = ownerPolicyFactory.addOwnerPolicy({
    name: 'Users should be able to add their own rows',
    table: cInsertTable.table,
    for: 'INSERT',
    to: [createPolicyToRole(authenticatedRole)],
});
