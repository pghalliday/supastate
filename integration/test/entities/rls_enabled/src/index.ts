import {Supatest} from "@pghalliday/supatest";
import {Supastate} from "@pghalliday/supastate";

const supatest = new Supatest();

const create = new Supastate();
const authSchema = create.addSchema({name: 'auth', external: true});
const usersTable = create.addTable({name: 'users', schema: authSchema, external: true});
const usersRLSEnabled = create.addRLSEnabled({table: usersTable, external: true});
const publicSchema = create.addSchema({name: 'public', external: true});
const publicT1Table = create.addTable({name: 't1', schema: publicSchema});
const publicT1RLSEnabled = create.addRLSEnabled({table: publicT1Table});
const s1Schema = create.addSchema({name: 's1'});
const s1T1Table = create.addTable({name: 't1', schema: s1Schema});
const s1T1RLSEnabled = create.addRLSEnabled({table: s1T1Table});
supatest.setSupastate(create);

supatest.hasRLS(usersTable);
supatest.hasRLS(publicT1Table);
supatest.hasRLS(s1T1Table);

const drop = new Supastate();
supatest.setSupastate(drop);

supatest.hasRLS(usersTable);
supatest.hasSchema(publicSchema);
supatest.hasntTable(publicT1Table);
supatest.hasntSchema(s1Schema);

await supatest.writeSQL();
