import {Supastate, policyToBuiltIn, policyToRole, expression} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const supastate = new Supastate();

const authenticatedRole = supastate.addRole({name: 'authenticated', external: true});

const authSchema = supastate.addSchema({name: 'auth', external: true});
const usersTable = supastate.addTable({name: 'users', schema: authSchema, external: true});
const usersIdColumn = supastate.addColumn({table: usersTable, name: 'id', type: 'uuid', external: true});

const publicSchema = supastate.addSchema({name: 'public', external: true});
const profilesTable = supastate.addTable({name: 'profiles', schema: publicSchema});
const profilesUserIdColumn = supastate.addColumn({table: profilesTable, name: 'userId', type: 'uuid'});
const profilesForeignKey = supastate.addForeignKeyConstraint({
    name: 'fk',
    table: profilesTable,
    otherTable: usersTable,
    columns: [profilesUserIdColumn],
    otherColumns: [usersIdColumn],
});

const ownerPolicy = supastate.addPolicy({
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

await writeSql({
    'sql/supastate.sql': supastate.migrate({}),
});
