import {Supastate} from "@pghalliday/supastate";
import {writeSql} from "supastate-test-utils";

const create = new Supastate();
const authenticatedRole = create.addRole({name: 'authenticated', external: true});
const s1Schema = create.addRole({name: 'r1'});

const drop = new Supastate();

await writeSql([
    create.migrate({}),
    drop.migrate(create.entities),
]);
