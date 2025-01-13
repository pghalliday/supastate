import {Supastate} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const supastate = new Supastate();
const authSchema = supastate.addSchema({name: 'auth', external: true});
const usersTable = supastate.addTable({name: 'users', schema: authSchema, external: true});
const usersIdColumn = supastate.addColumn({table: usersTable, name: 'id', type: 'uuid', external: true});
const usersPrimaryKey = supastate.addNotNullConstraint({column: usersIdColumn, external: true});
const publicSchema = supastate.addSchema({name: 'public', external: true});
const publicT1Table = supastate.addTable({name: 't1', schema: publicSchema});
const publicT1IdColumn = supastate.addColumn({table: publicT1Table, name: 'id', type: 'uuid'});
const publicT1PrimaryKey = supastate.addNotNullConstraint({column: publicT1IdColumn});
const s1Schema = supastate.addSchema({name: 's1'});
const s1T1Table = supastate.addTable({name: 't1', schema: s1Schema});
const s1T1IdColumn = supastate.addColumn({table: s1T1Table, name: 'id', type: 'uuid'});
const s1T1PrimaryKey = supastate.addNotNullConstraint({column: s1T1IdColumn});

await writeSql({
    'sql/supastate.sql': supastate.migrate({}),
});
