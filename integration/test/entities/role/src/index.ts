import {Supatest} from "@pghalliday/supatest";
import {Supastate} from "@pghalliday/supastate";

const supatest = new Supatest();

const create = new Supastate();
const authenticatedRole = create.addRole({name: 'authenticated', external: true});
const r1Role = create.addRole({name: 'r1'});
supatest.setSupastate(create);

supatest.hasRole(authenticatedRole);
supatest.hasRole(r1Role);

const drop = new Supastate();
supatest.setSupastate(drop);

supatest.hasRole(authenticatedRole);
supatest.hasntRole(r1Role);

await supatest.writeSQL();
