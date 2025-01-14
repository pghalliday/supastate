import {Supastate} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const create = new Supastate();
const authSchema = create.addSchema({name: 'auth', external: true});
const s1Schema = create.addSchema({name: 's1'});

const drop = new Supastate();

await writeSql([
    create.migrate({}),
    drop.migrate(create.entities),
]);
