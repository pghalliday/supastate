import {Supastate, policyToBuiltIn, policyToRole, expression} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const create = new Supastate();

const authenticatedRole = create.addRole({name: 'authenticated', external: true});

const authSchema = create.addSchema({name: 'auth', external: true});
const usersTable = create.addTable({name: 'users', schema: authSchema, external: true});
const usersIdColumn = create.addColumn({table: usersTable, name: 'id', type: 'uuid', external: true});

const publicSchema = create.addSchema({name: 'public', external: true});
const profilesTable = create.addTable({name: 'profiles', schema: publicSchema});
const profilesUserIdColumn = create.addColumn({table: profilesTable, name: 'userId', type: 'uuid'});
const profilesForeignKey = create.addForeignKeyConstraint({
    name: 'fk',
    table: profilesTable,
    otherTable: usersTable,
    columns: [profilesUserIdColumn],
    otherColumns: [usersIdColumn],
});

const ownerPolicy = create.addPolicy({
    name: 'owner can do anything',
    table: profilesTable,
    as: 'PERMISSIVE',
    for: 'ALL',
    to: [policyToBuiltIn('CURRENT_ROLE'), policyToRole(authenticatedRole)],
    using: expression('(select auth.uid()) = {{{profilesUserIdColumn}}}', {
        profilesUserIdColumn
    }),
    withCheck: expression('(select auth.uid()) = {{{profilesUserIdColumn}}}', {
        profilesUserIdColumn
    }),
});

const drop = new Supastate();

await writeSql([
    create.migrate({}),
    drop.migrate(create.entities),
]);
