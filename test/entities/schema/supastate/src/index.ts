import {mkdir, writeFile} from "node:fs/promises";
import {Supastate} from "@pghalliday/supastate";

const supastate = new Supastate();
const authSchema = supastate.addSchema({name: 'auth', external: true});
const s1Schema = supastate.addSchema({name: 's1'});

await mkdir('../sql', {recursive: true});
await writeFile('../sql/supastate.sql', supastate.migrate({}));
