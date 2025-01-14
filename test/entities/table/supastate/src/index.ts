import {Supastate} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const create = new Supastate();
const authSchema = create.addSchema({name: 'auth', external: true});
const usersTable = create.addTable({name: 'users', schema: authSchema, external: true});
const publicSchema = create.addSchema({name: 'public', external: true});
const publicT1Table = create.addTable({name: 't1', schema: publicSchema});
const s1Schema = create.addSchema({name: 's1'});
const s1T1Table = create.addTable({name: 't1', schema: s1Schema});

const drop = new Supastate();

await writeSql([
    create.migrate({}),
    drop.migrate(create.entities),
]);
