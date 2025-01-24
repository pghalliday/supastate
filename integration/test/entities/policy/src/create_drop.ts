import {Supatest} from "@pghalliday/supatest";
import {create, ownerPolicy, profilesTable, publicSchema, usersIdColumn} from "./supastates/create.js";
import {drop} from "./supastates/drop.js";

export const supatest = new Supatest();

supatest.setSupastate(create);

supatest.hasRLS(profilesTable);
supatest.policiesAre(profilesTable, ['owner can do anything']);
supatest.policyRolesAre(ownerPolicy, ['postgres', 'authenticated']);
supatest.policyCmdIs(ownerPolicy, 'ALL');

supatest.setSupastate(drop);

supatest.hasColumn(usersIdColumn);
supatest.hasSchema(publicSchema);
supatest.hasntTable(profilesTable);

supatest.writeSQL();
