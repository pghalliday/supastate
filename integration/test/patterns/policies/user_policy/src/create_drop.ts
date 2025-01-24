import {Supatest} from "@pghalliday/supatest";
import {
    cAllPolicy,
    cAllTable,
    cDeletePolicy,
    cDeleteTable,
    cInsertPolicy,
    cInsertTable,
    create,
    cSelectPolicy,
    cSelectTable,
    cUpdatePolicy,
    cUpdateTable
} from "./supastates/create.js";
import {drop} from "./supastates/drop.js";

export const supatest = new Supatest();

supatest.setSupastate(create);

supatest.hasRLS(cSelectTable.table);
supatest.policiesAre(cSelectTable.table, ['Authenticated should be able to select']);
supatest.policyRolesAre(cSelectPolicy.policy, ['authenticated']);
supatest.policyCmdIs(cSelectPolicy.policy, 'SELECT');

supatest.hasRLS(cInsertTable.table);
supatest.policiesAre(cInsertTable.table, ['Authenticated should be able to insert']);
supatest.policyRolesAre(cInsertPolicy.policy, ['authenticated']);
supatest.policyCmdIs(cInsertPolicy.policy, 'INSERT');

supatest.hasRLS(cUpdateTable.table);
supatest.policiesAre(cUpdateTable.table, ['Authenticated should be able to update']);
supatest.policyRolesAre(cUpdatePolicy.policy, ['authenticated']);
supatest.policyCmdIs(cUpdatePolicy.policy, 'UPDATE');

supatest.hasRLS(cDeleteTable.table);
supatest.policiesAre(cDeleteTable.table, ['Authenticated should be able to delete']);
supatest.policyRolesAre(cDeletePolicy.policy, ['authenticated']);
supatest.policyCmdIs(cDeletePolicy.policy, 'DELETE');

supatest.hasRLS(cAllTable.table);
supatest.policiesAre(cAllTable.table, ['Authenticated should be able to do all']);
supatest.policyRolesAre(cAllPolicy.policy, ['authenticated']);
supatest.policyCmdIs(cAllPolicy.policy, 'ALL');

supatest.setSupastate(drop);

supatest.hasntTable(cSelectTable.table);
supatest.hasntTable(cInsertTable.table);
supatest.hasntTable(cUpdateTable.table);
supatest.hasntTable(cDeleteTable.table);
supatest.hasntTable(cAllTable.table);

await supatest.writeSQL();
