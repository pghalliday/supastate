import {Supatest} from "@pghalliday/supatest";
import {create, profilesTable, publicSchema, usersIdColumn} from "./supastates/create.js";
import {drop} from "./supastates/drop.js";

export const supatest = new Supatest();

supatest.setSupastate(create);

supatest.hasRLS(profilesTable);
supatest.policies_are('public', 'profiles', array ['owner can do anything']);
supatest.policy_roles_are('public', 'profiles', 'owner can do anything', array ['postgres', 'authenticated']);
supatest.policy_cmd_is('public', 'profiles', 'owner can do anything'::name, 'ALL');

supatest.setSupastate(drop);

supatest.hasColumn(usersIdColumn);
supatest.hasSchema(publicSchema);
supatest.hasntTable(profilesTable);

supatest.writeSQL();
