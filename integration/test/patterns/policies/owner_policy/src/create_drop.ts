import {Supatest} from "@pghalliday/supatest";
import {
    cInsertPolicy,
    cInsertTable,
    create, cSelectPolicy, cSelectTable,
} from "./supastates/create.js";
import {drop} from "./supastates/drop.js";

export const supatest = new Supatest();

supatest.setSupastate(create);

supatest.hasRLS(cSelectTable.table);
supatest.policiesAre(cSelectTable.table, ['Users should be able to select their own rows']);
supatest.policyRolesAre(cSelectPolicy.policy, ['authenticated']);
supatest.policyCmdIs(cSelectPolicy.policy, 'SELECT');

supatest.hasRLS(cInsertTable.table);
supatest.policiesAre(cInsertTable.table, ['Users should be able to add their own rows']);
supatest.policyRolesAre(cInsertPolicy.policy, ['authenticated']);
supatest.policyCmdIs(cInsertPolicy.policy, 'INSERT');

supatest.setSupastate(drop);

supatest.hasntTable(cSelectTable.table);
supatest.hasntTable(cInsertTable.table);

await supatest.writeSQL();
