import {Supastate} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const supastate = new Supastate();
const authenticatedRole = supastate.addRole({name: 'authenticated', external: true});
const s1Schema = supastate.addRole({name: 'r1'});

await writeSql({
    'sql/supastate.sql': supastate.migrate({}),
});
