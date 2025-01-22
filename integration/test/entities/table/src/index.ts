import {Supatest} from "@pghalliday/supatest";
import {Supastate} from "@pghalliday/supastate";

const supatest = new Supatest();

const create = new Supastate();
const authSchema = create.addSchema({name: 'auth', external: true});
const usersTable = create.addTable({name: 'users', schema: authSchema, external: true});
const publicSchema = create.addSchema({name: 'public', external: true});
const publicT1Table = create.addTable({name: 't1', schema: publicSchema});
const s1Schema = create.addSchema({name: 's1'});
const s1T1Table = create.addTable({name: 't1', schema: s1Schema});
supatest.setSupastate(create);

supatest.hasTable(usersTable);
supatest.hasTable(publicT1Table);
supatest.hasTable(s1T1Table);

const drop = new Supastate();
supatest.setSupastate(drop);

supatest.hasTable(usersTable);
supatest.hasntTable(publicT1Table);
supatest.hasntSchema(s1Schema);

await supatest.writeSQL();
