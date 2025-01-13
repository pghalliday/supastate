import {mkdir, writeFile} from "node:fs/promises";
import {Supastate} from "@pghalliday/supastate";

const supastate = new Supastate();
const authSchema = supastate.addSchema({name: 'auth', external: true});
const usersTable = supastate.addTable({name: 'users', schema: authSchema, external: true});
const usersIdColumn = supastate.addColumn({table: usersTable, name: 'id', type: 'uuid', external: true});
const usersPrimaryKey = supastate.addPrimaryKeyConstraint({table: usersTable, name: 'pk', columns: [usersIdColumn], external: true});
const publicSchema = supastate.addSchema({name: 'public', external: true});
const publicT1Table = supastate.addTable({name: 't1', schema: publicSchema});
const publicT1IdColumn = supastate.addColumn({table: publicT1Table, name: 'id', type: 'uuid'});
const publicT1PrimaryKey = supastate.addPrimaryKeyConstraint({table: publicT1Table, name: 'pk', columns: [publicT1IdColumn]});
const s1Schema = supastate.addSchema({name: 's1'});
const s1T1Table = supastate.addTable({name: 't1', schema: s1Schema});
const s1T1IdColumn = supastate.addColumn({table: s1T1Table, name: 'id', type: 'uuid'});
const s1T1PrimaryKey = supastate.addPrimaryKeyConstraint({table: s1T1Table, name: 'pk', columns: [s1T1IdColumn]});

await mkdir('../sql', {recursive: true});
await writeFile('../sql/supastate.sql', supastate.migrate({}));
