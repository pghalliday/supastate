import {Supastate} from "@pghalliday/supastate";
import {createExpression, createPolicyToBuiltIn, createPolicyToRole} from "@pghalliday/supastate/util";

export const create = new Supastate();

export const authenticatedRole = create.addRole({name: 'authenticated', external: true});

export const authSchema = create.addSchema({name: 'auth', external: true});
export const usersTable = create.addTable({name: 'users', schema: authSchema, external: true});
export const usersIdColumn = create.addColumn({table: usersTable, name: 'id', type: 'uuid', external: true});

export const publicSchema = create.addSchema({name: 'public', external: true});
export const profilesTable = create.addTable({name: 'profiles', schema: publicSchema});
export const profilesRLSEnabled = create.addRLSEnabled({table: profilesTable});
export const profilesUserIdColumn = create.addColumn({table: profilesTable, name: 'user_id', type: 'uuid'});
export const profilesForeignKey = create.addForeignKeyConstraint({
    name: 'fk',
    table: profilesTable,
    otherTable: usersTable,
    columns: [profilesUserIdColumn],
    otherColumns: [usersIdColumn],
});

export const ownerPolicy = create.addPolicy({
    name: 'owner can do anything',
    table: profilesTable,
    as: 'PERMISSIVE',
    for: 'ALL',
    to: [createPolicyToBuiltIn('CURRENT_ROLE'), createPolicyToRole(authenticatedRole)],
    using: createExpression('(select auth.uid()) = {{{profilesUserIdColumn}}}', {
        profilesUserIdColumn
    }),
    withCheck: createExpression('(select auth.uid()) = {{{profilesUserIdColumn}}}', {
        profilesUserIdColumn
    }),
});
