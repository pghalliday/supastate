import {Supastate} from "@pghalliday/supastate";
import {Entity, Role, Schema, Table, Column, ForeignKeyConstraint, Policy} from "@pghalliday/supastate/entities";
import {argv} from "node:process";
import {mkdir, writeFile} from "node:fs/promises";
import {dirname} from "node:path";
import _ from 'lodash';
import assert from "node:assert";
const {join, split, map} = _;

export class Supatest {
    private testCount: number = 0;
    knownEntities: Record<string, Entity> = {};
    private currentEntities: Record<string, Entity> = {};
    private sql: string = '';

    setSupastate(supastate: Supastate) {
        this.sql += supastate.migrate(this.currentEntities);
        this.currentEntities = supastate.entities;
        this.knownEntities = {
            ...this.knownEntities,
            ...this.currentEntities
        };
    }

    hasRole(role: Role) {
        this.sql += `select has_role('${role.name}');\n`;
        this.testCount++;
    }

    hasntRole(role: Role) {
        this.sql += `select hasnt_role('${role.name}');\n`;
        this.testCount++;
    }

    hasSchema(schema: Schema) {
        this.sql += `select has_schema('${schema.name}');\n`;
        this.testCount++;
    }

    hasntSchema(schema: Schema) {
        this.sql += `select hasnt_schema('${schema.name}');\n`;
        this.testCount++;
    }

    hasTable(table: Table) {
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        this.sql += `select has_table('${schema.name}', '${table.name}'::name);\n`;
        this.testCount++;
    }

    hasntTable(table: Table) {
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        this.sql += `select hasnt_table('${schema.name}', '${table.name}'::name);\n`;
        this.testCount++;
    }

    hasColumn(column: Column) {
        const table = this.knownEntities[column.tableId];
        assert(table.entityType === 'table');
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        this.sql += `select has_column(
    '${schema.name}',
    '${table.name}',
    '${column.name}',
    'Column ${schema.name}.${table.name}(${column.name}) should exist'
);
`;
        this.testCount++;
    }

    colIsPk(column: Column) {
        const table = this.knownEntities[column.tableId];
        assert(table.entityType === 'table');
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        this.sql += `select col_is_pk(
    '${schema.name}',
    '${table.name}',
    '${column.name}',
    'Column ${schema.name}.${table.name}(${column.name}) should be a primary key'
);
`;
        this.testCount++;
    }

    fkOk(foreignKeyConstraint: ForeignKeyConstraint) {
        const columnNames = map(foreignKeyConstraint.columnIds, columnId => {
            const column = this.knownEntities[columnId];
            assert(column.entityType === 'column');
            return `'${column.name}'`;
        });
        const table = this.knownEntities[foreignKeyConstraint.tableId];
        assert(table.entityType === 'table');
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        const otherColumnNames = map(foreignKeyConstraint.otherColumnIds, columnId => {
            const column = this.knownEntities[columnId];
            assert(column.entityType === 'column');
            return `'${column.name}'`;
        });
        const otherTable = this.knownEntities[foreignKeyConstraint.otherTableId];
        assert(otherTable.entityType === 'table');
        const otherSchema = this.knownEntities[otherTable.schemaId];
        assert(otherSchema.entityType === 'schema');
        this.sql += `select fk_ok(
    '${schema.name}',
    '${table.name}',
    array [${join(columnNames, ', ')}],
    '${otherSchema.name}',
    '${otherTable.name}',
    array [${join(otherColumnNames, ', ')}]
);
`;
        this.testCount++;
    }

    colNotNull(column: Column) {
        const table = this.knownEntities[column.tableId];
        assert(table.entityType === 'table');
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        this.sql += `select col_not_null(
    '${schema.name}',
    '${table.name}',
    '${column.name}'::name
);
`;
        this.testCount++;
    }

    colTypeIs(column: Column, type: string) {
        const table = this.knownEntities[column.tableId];
        assert(table.entityType === 'table');
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        this.sql += `select col_type_is(
    '${schema.name}',
    '${table.name}',
    '${column.name}'::name,
    '${type}'
);
`;
        this.testCount++;
    }

    hasRLS(table: Table) {
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        this.sql += `select st_has_rls('${schema.name}', '${table.name}'::name);\n`;
        this.testCount++;
    }

    policiesAre(table: Table, policyNames: string[]) {
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        const quotedNames = map(policyNames, name => `'${name}'`)
        this.sql += `select policies_are('${schema.name}', '${table.name}', array [${quotedNames.join(', ')}]);\n`;
        this.testCount++;
    }

    policyRolesAre(policy: Policy, policyRoles: string[]) {
        const table = this.knownEntities[policy.tableId];
        assert(table.entityType === 'table');
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        const quotedRoles = map(policyRoles, role => `'${role}'`)
        this.sql += `select policy_roles_are('${schema.name}', '${table.name}', '${policy.name}', array [${quotedRoles.join(', ')}]);\n`;
        this.testCount++;
    }

    policyCmdIs(policy: Policy, cmd: string) {
        const table = this.knownEntities[policy.tableId];
        assert(table.entityType === 'table');
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        this.sql += `select policy_cmd_is('${schema.name}', '${table.name}', '${policy.name}'::name, '${cmd}');\n`;
        this.testCount++;
    }

    createSupabaseUser(userIdentifier: string) {
        this.sql += `select tests.create_supabase_user('${userIdentifier}');\n`;
    }

    authenticateAs(userIdentifier: string) {
        this.sql += `select tests.authenticate_as('${userIdentifier}');\n`;
    }

    clearAuthentication() {
        this.sql += `select tests.clear_authentication();\n`;
    }

    throwsOk(sql: string, error: string, description: string) {
        this.sql += `select throws_ok(
    $_sql_$${sql}$_sql_$,
    $_error_$${error}$_error_$,
    $_description_$${description}$_description_$
);\n`;
        this.testCount++;
    }

    livesOk(sql: string, description: string) {
        this.sql += `select lives_ok(
    $_sql_$${sql}$_sql_$,
    $_description_$${description}$_description_$
);\n`;
        this.testCount++;
    }

    async writeSQL() {
        const sqlFile = argv[2];
        await mkdir(dirname(sqlFile), {recursive: true});
        await writeFile(sqlFile, `begin;

create extension if not exists pgtap with schema extensions cascade;
create extension if not exists "basejump-supabase_test_helpers";
create extension if not exists supatest with schema extensions cascade;

select plan(${this.testCount});

${this.sql}
select * from finish();

rollback;
`);
    }
}
