import {Supastate} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const supastate = new Supastate();
const authSchema = supastate.addSchema({name: 'auth', external: true});
const usersTable = supastate.addTable({name: 'users', schema: authSchema, external: true});
const usersRLSEnabled = supastate.addRLSEnabled({table: usersTable, external: true});
const publicSchema = supastate.addSchema({name: 'public', external: true});
const publicT1Table = supastate.addTable({name: 't1', schema: publicSchema});
const publicT1RLSEnabled = supastate.addRLSEnabled({table: publicT1Table});
const s1Schema = supastate.addSchema({name: 's1'});
const s1T1Table = supastate.addTable({name: 't1', schema: s1Schema});
const s1T1RLSEnabled = supastate.addRLSEnabled({table: s1T1Table});

await writeSql([
    supastate.migrate({}),
]);
