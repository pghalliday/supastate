import {mkdir, writeFile} from "node:fs/promises";
import {Supastate} from "@pghalliday/supastate";

const supastate = new Supastate();
const authenticatedRole = supastate.addRole({name: 'authenticated', external: true});
const s1Schema = supastate.addRole({name: 'r1'});

await mkdir('../sql', {recursive: true});
await writeFile('../sql/supastate.sql', supastate.migrate({}));
