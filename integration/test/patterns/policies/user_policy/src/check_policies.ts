import {Supatest} from "@pghalliday/supatest";
import {Supasql} from "@pghalliday/supasql";
import {
    cAllColumn,
    cAllTable, cDeleteColumn,
    cDeleteTable, cInsertColumn,
    cInsertTable,
    create, cSelectColumn,
    cSelectTable,
    cUpdateColumn,
    cUpdateTable
} from "./supastates/create.js";

const supatest = new Supatest();
const supasql = new Supasql();

supatest.setSupastate(create);
supasql.addSupastate(create);

supatest.createSupabaseUser('user_1');
supatest.createSupabaseUser('user_2');
supatest.createSupabaseUser('user_3');
supatest.createSupabaseUser('user_4');

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

supatest.execute(
    supasql.insert()
        .into(cInsertTable.table)
        .columns([cInsertTable.primaryKeyColumn, cInsertTable.foreignKeyColumn])
        .values([supasql.toUuid('c_1_1'), supasql.getSupabaseUID('user_1')])
        .values([supasql.toUuid('c_1_2'), supasql.getSupabaseUID('user_1')])
        .values([supasql.toUuid('c_1_3'), supasql.getSupabaseUID('user_1')])
        .values([supasql.toUuid('c_2_1'), supasql.getSupabaseUID('user_2')])
        .values([supasql.toUuid('c_2_2'), supasql.getSupabaseUID('user_2')])
        .values([supasql.toUuid('c_3_1'), supasql.getSupabaseUID('user_3')])
        .build()
);

supatest.execute(
    supasql.insert()
        .into(cUpdateTable.table)
        .columns([cUpdateTable.primaryKeyColumn, cUpdateTable.foreignKeyColumn])
        .values([supasql.toUuid('c_1_1'), supasql.getSupabaseUID('user_1')])
        .values([supasql.toUuid('c_1_2'), supasql.getSupabaseUID('user_1')])
        .values([supasql.toUuid('c_1_3'), supasql.getSupabaseUID('user_1')])
        .values([supasql.toUuid('c_2_1'), supasql.getSupabaseUID('user_2')])
        .values([supasql.toUuid('c_2_2'), supasql.getSupabaseUID('user_2')])
        .values([supasql.toUuid('c_3_1'), supasql.getSupabaseUID('user_3')])
        .build()
);

supatest.execute(
    supasql.insert()
        .into(cDeleteTable.table)
        .columns([cDeleteTable.primaryKeyColumn, cDeleteTable.foreignKeyColumn])
        .values([supasql.toUuid('c_1_1'), supasql.getSupabaseUID('user_1')])
        .values([supasql.toUuid('c_1_2'), supasql.getSupabaseUID('user_1')])
        .values([supasql.toUuid('c_1_3'), supasql.getSupabaseUID('user_1')])
        .values([supasql.toUuid('c_2_1'), supasql.getSupabaseUID('user_2')])
        .values([supasql.toUuid('c_2_2'), supasql.getSupabaseUID('user_2')])
        .values([supasql.toUuid('c_3_1'), supasql.getSupabaseUID('user_3')])
        .build()
);

supatest.execute(
    supasql.insert()
        .into(cAllTable.table)
        .columns([cAllTable.primaryKeyColumn, cAllTable.foreignKeyColumn])
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
        .values([supasql.toUuid('c_4_1'), supasql.getSupabaseUID('user_4')])
        .build(),
    'new row violates row-level security policy for table "c_insert"',
    'Unauthenticated users should not be able to insert into c_insert'
);

supatest.isEmpty(
    supasql.update()
        .table(cUpdateTable.table)
        .set(cUpdateColumn, 'bar')
        .returning(0)
        .build(),
    'Unauthenticated users should not be able to update rows in c_update'
);

supatest.isEmpty(
    supasql.delete()
        .from(cDeleteTable.table)
        .returning(0)
        .build(),
    'Unauthenticated users should not be able to delete any rows from c_delete'
);

supatest.isEmpty(
    supasql.select()
        .value(supasql.fromUuid(cAllTable.primaryKeyColumn))
        .from(cAllTable.table)
        .build(),
    'Unauthenticated users should not be able to select any rows from c_all'
);

supatest.throwsOk(
    supasql.insert()
        .into(cAllTable.table)
        .columns([cAllTable.primaryKeyColumn, cAllTable.foreignKeyColumn])
        .values([supasql.toUuid('c_4_1'), supasql.getSupabaseUID('user_4')])
        .build(),
    'new row violates row-level security policy for table "c_all"',
    'Unauthenticated users should not be able to insert into c_all'
);

supatest.isEmpty(
    supasql.update()
        .table(cAllTable.table)
        .set(cAllColumn, 'bar')
        .returning(0)
        .build(),
    'Unauthenticated users should not be able to update rows in c_all'
);

supatest.isEmpty(
    supasql.delete()
        .from(cAllTable.table)
        .returning(0)
        .build(),
    'Unauthenticated users should not be able to delete any rows from c_all'
);

supatest.authenticateAs('user_4');

supatest.setEq(
    supasql.select()
        .value(supasql.fromUuid(cSelectTable.primaryKeyColumn))
        .from(cSelectTable.table)
        .build(),
    [
        'c_1_1',
        'c_1_2',
        'c_1_3',
        'c_2_1',
        'c_2_2',
        'c_3_1'
    ],
    'Authenticated users should be able to select all rows from c_select'
);

supatest.throwsOk(
    supasql.insert()
        .into(cSelectTable.table)
        .columns([cSelectTable.primaryKeyColumn, cSelectTable.foreignKeyColumn])
        .values([supasql.toUuid('c_4_1'), supasql.getSupabaseUID('user_4')])
        .build(),
    'new row violates row-level security policy for table "c_select"',
    'Authenticated users should not be able to insert into c_select'
);

supatest.isEmpty(
    supasql.update()
        .table(cSelectTable.table)
        .set(cSelectColumn, 'bar')
        .returning(0)
        .build(),
    'Authenticated users should not be able to update rows in c_select'
);

supatest.isEmpty(
    supasql.delete()
        .from(cSelectTable.table)
        .returning(0)
        .build(),
    'Authenticated users should not be able to delete any rows from c_select'
);

supatest.isEmpty(
    supasql.select()
        .value(supasql.fromUuid(cInsertTable.primaryKeyColumn))
        .from(cInsertTable.table)
        .build(),
    'Authenticated users should not be able to select from c_insert'
);

supatest.livesOk(
    supasql.insert()
        .into(cInsertTable.table)
        .columns([cInsertTable.primaryKeyColumn, cInsertTable.foreignKeyColumn])
        .values([supasql.toUuid('c_4_1'), supasql.getSupabaseUID('user_4')])
        .build(),
    'Authenticated users should be able to insert into c_insert'
);

supatest.isEmpty(
    supasql.update()
        .table(cInsertTable.table)
        .set(cInsertColumn, 'bar')
        .returning(0)
        .build(),
    'Authenticated users should not be able to update rows in c_insert'
);

supatest.isEmpty(
    supasql.delete()
        .from(cInsertTable.table)
        .returning(0)
        .build(),
    'Authenticated users should not be able to delete any rows from c_insert'
);

supatest.isEmpty(
    supasql.select()
        .value(supasql.fromUuid(cDeleteTable.primaryKeyColumn))
        .from(cDeleteTable.table)
        .build(),
    'Authenticated users should not be able to select from c_delete'
);

supatest.throwsOk(
    supasql.insert()
        .into(cDeleteTable.table)
        .columns([cDeleteTable.primaryKeyColumn, cDeleteTable.foreignKeyColumn])
        .values([supasql.toUuid('c_4_1'), supasql.getSupabaseUID('user_4')])
        .build(),
    'new row violates row-level security policy for table "c_delete"',
    'Authenticated users should not be able to insert into c_delete'
);

supatest.isEmpty(
    supasql.update()
        .table(cDeleteTable.table)
        .set(cDeleteColumn, 'bar')
        .returning(0)
        .build(),
    'Authenticated users should not be able to update rows in c_delete'
);

supatest.isntEmpty(
    supasql.delete()
        .from(cDeleteTable.table)
        .returning(0)
        .build(),
    'Authenticated users should be able to delete from c_delete'
);

supatest.isEmpty(
    supasql.select()
        .value(supasql.fromUuid(cUpdateTable.primaryKeyColumn))
        .from(cUpdateTable.table)
        .build(),
    'Authenticated users should not be able to select from c_update'
);

supatest.throwsOk(
    supasql.insert()
        .into(cUpdateTable.table)
        .columns([cUpdateTable.primaryKeyColumn, cUpdateTable.foreignKeyColumn])
        .values([supasql.toUuid('c_4_1'), supasql.getSupabaseUID('user_4')])
        .build(),
    'new row violates row-level security policy for table "c_update"',
    'Authenticated users should not be able to insert into c_update'
);

supatest.isntEmpty(
    supasql.update()
        .table(cUpdateTable.table)
        .set(cUpdateColumn, 'bar')
        .returning(0)
        .build(),
    'Authenticated users should be able to update rows in c_update'
);

supatest.isEmpty(
    supasql.delete()
        .from(cUpdateTable.table)
        .returning(0)
        .build(),
    'Authenticated users should not be able to delete from c_update'
);

supatest.setEq(
    supasql.select()
        .value(supasql.fromUuid(cAllTable.primaryKeyColumn))
        .from(cAllTable.table)
        .build(),
    [
        'c_1_1',
        'c_1_2',
        'c_1_3',
        'c_2_1',
        'c_2_2',
        'c_3_1'
    ],
    'Authenticated users should be able to select all rows from c_all'
);

supatest.livesOk(
    supasql.insert()
        .into(cAllTable.table)
        .columns([cAllTable.primaryKeyColumn, cAllTable.foreignKeyColumn])
        .values([supasql.toUuid('c_4_1'), supasql.getSupabaseUID('user_4')])
        .build(),
    'Authenticated users should be able to insert into c_all'
);

supatest.isntEmpty(
    supasql.update()
        .table(cAllTable.table)
        .set(cAllColumn, 'bar')
        .returning(0)
        .build(),
    'Authenticated users should be able to update rows in c_all'
);

supatest.isntEmpty(
    supasql.delete()
        .from(cAllTable.table)
        .returning(0)
        .build(),
    'Authenticated users should be able to delete from c_all'
);

await supatest.writeSQL();
