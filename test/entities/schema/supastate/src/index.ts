import {Supastate} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const supastate = new Supastate();
const authSchema = supastate.addSchema({name: 'auth', external: true});
const s1Schema = supastate.addSchema({name: 's1'});

await writeSql([
    supastate.migrate({}),
]);
