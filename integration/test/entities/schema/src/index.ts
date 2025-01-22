import {Supatest} from "@pghalliday/supatest";
import {Supastate} from "@pghalliday/supastate";

const supatest = new Supatest();

const create = new Supastate();
const authSchema = create.addSchema({name: 'auth', external: true});
const s1Schema = create.addSchema({name: 's1'});
supatest.setSupastate(create);

supatest.hasSchema(authSchema);
supatest.hasSchema(s1Schema);

const drop = new Supastate();
supatest.setSupastate(drop);

supatest.hasSchema(authSchema);
supatest.hasntSchema(s1Schema);

await supatest.writeSQL();
