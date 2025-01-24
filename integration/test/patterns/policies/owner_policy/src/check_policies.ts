import {Supatest} from "@pghalliday/supatest";
import {Supasql} from "@pghalliday/supasql";
import {
    cInsertTable,
    create, cSelectTable,
} from "./supastates/create.js";

const supatest = new Supatest();
const supasql = new Supasql();

supatest.setSupastate(create);
supasql.addSupastate(create);

supatest.createSupabaseUser('user_1');
supatest.createSupabaseUser('user_2');
supatest.createSupabaseUser('user_3');

supatest.execute(
    supasql.insert()
        .into(cSelectTable.table)
        .columns([cSelectTable.primaryKeyColumn, cSelectTable.foreignKeyColumn])
        .values([supasql.toUuid('c_1_1'), supasql.getSupabaseUID('user_1')])
        .values([supasql.toUuid('c_1_2'), supasql.getSupabaseUID('user_1')])
        .values([supasql.toUuid('c_1_3'), supasql.getSupabaseUID('user_1')])
        .values([supasql.toUuid('c_2_1'), supasql.getSupabaseUID('user_2')])
        .values([supasql.toUuid('c_2_2'), supasql.getSupabaseUID('user_2')])
        .values([supasql.toUuid('c_3_1'), supasql.getSupabaseUID('user_3')])
        .build()
);

supatest.clearAuthentication();

supatest.isEmpty(
    supasql.select()
        .value(supasql.fromUuid(cSelectTable.primaryKeyColumn))
        .from(cSelectTable.table)
        .build(),
    'Unauthenticated users should not be able to select any rows from c_select'
);

supatest.throwsOk(
    supasql.insert()
        .into(cInsertTable.table)
        .columns([cInsertTable.primaryKeyColumn, cInsertTable.foreignKeyColumn])
        .values([supasql.toUuid('c_1_1'), supasql.getSupabaseUID('user_1')])
        .build(),
    'new row violates row-level security policy for table "c_insert"',
    'Unauthenticated users should not be able to insert any rows into c_insert'
);

supatest.authenticateAs('user_1');

supatest.setEq(
    supasql.select()
        .value(supasql.fromUuid(cSelectTable.primaryKeyColumn))
        .from(cSelectTable.table)
        .build(),
    [
        'c_1_1',
        'c_1_2',
        'c_1_3'
    ],
    'User 1 should only be able to select their own rows from c_select'
);

supatest.livesOk(
    supasql.insert()
        .into(cInsertTable.table)
        .columns([cInsertTable.primaryKeyColumn, cInsertTable.foreignKeyColumn])
        .values([supasql.toUuid('c_1_1'), supasql.getSupabaseUID('user_1')])
        .build(),
    'User 1 should be able to insert rows for themselves into c_insert'
);

supatest.throwsOk(
    supasql.insert()
        .into(cInsertTable.table)
        .columns([cInsertTable.primaryKeyColumn, cInsertTable.foreignKeyColumn])
        .values([supasql.toUuid('c_2_1'), supasql.getSupabaseUID('user_2')])
        .build(),
    'new row violates row-level security policy for table "c_insert"',
    'User 1 should not be able to insert rows for other users into c_insert'
);

await supatest.writeSQL();
