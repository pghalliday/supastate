import {Supastate} from "@pghalliday/supastate";
import {
    Role,
    Schema,
    Table,
    Column,
    ForeignKeyConstraint,
    Policy,
    Entities
} from "@pghalliday/supastate/entities";
import {argv} from "node:process";
import {mkdir, writeFile} from "node:fs/promises";
import {dirname} from "node:path";
import _ from 'lodash';
import assert from "node:assert";
const {join, split, map} = _;

export class Supatest {
    private testCount: number = 0;
    knownEntities: Entities = {};
    private currentEntities: Entities = {};
    private sql: string = '';

    execute(sql: string) {
        this.sql += `${sql};\n`;
    }

    setSupastate(supastate: Supastate) {
        this.sql += supastate.migrate(this.currentEntities);
        this.currentEntities = supastate.entities;
        this.knownEntities = {
            ...this.knownEntities,
            ...this.currentEntities
        };
    }

    hasRole(role: Role) {
        this.sql += `SELECT has_role('${role.name}');\n`;
        this.testCount++;
    }

    hasntRole(role: Role) {
        this.sql += `SELECT hasnt_role('${role.name}');\n`;
        this.testCount++;
    }

    hasSchema(schema: Schema) {
        this.sql += `SELECT has_schema('${schema.name}');\n`;
        this.testCount++;
    }

    hasntSchema(schema: Schema) {
        this.sql += `SELECT hasnt_schema('${schema.name}');\n`;
        this.testCount++;
    }

    hasTable(table: Table) {
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        this.sql += `SELECT has_table('${schema.name}', '${table.name}'::name);\n`;
        this.testCount++;
    }

    hasntTable(table: Table) {
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        this.sql += `SELECT hasnt_table('${schema.name}', '${table.name}'::name);\n`;
        this.testCount++;
    }

    hasColumn(column: Column) {
        const table = this.knownEntities[column.tableId];
        assert(table.entityType === 'table');
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        this.sql += `SELECT has_column(
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
        this.sql += `SELECT col_is_pk(
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
        this.sql += `SELECT fk_ok(
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
        this.sql += `SELECT col_not_null(
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
        this.sql += `SELECT col_type_is(
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
        this.sql += `SELECT st_has_rls('${schema.name}', '${table.name}'::name);\n`;
        this.testCount++;
    }

    policiesAre(table: Table, policyNames: string[]) {
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        const quotedNames = map(policyNames, name => `'${name}'`)
        this.sql += `SELECT policies_are('${schema.name}', '${table.name}', array [${quotedNames.join(', ')}]);\n`;
        this.testCount++;
    }

    policyRolesAre(policy: Policy, policyRoles: string[]) {
        const table = this.knownEntities[policy.tableId];
        assert(table.entityType === 'table');
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        const quotedRoles = map(policyRoles, role => `'${role}'`)
        this.sql += `SELECT policy_roles_are('${schema.name}', '${table.name}', '${policy.name}', array [${quotedRoles.join(', ')}]);\n`;
        this.testCount++;
    }

    policyCmdIs(policy: Policy, cmd: string) {
        const table = this.knownEntities[policy.tableId];
        assert(table.entityType === 'table');
        const schema = this.knownEntities[table.schemaId];
        assert(schema.entityType === 'schema');
        this.sql += `SELECT policy_cmd_is('${schema.name}', '${table.name}', '${policy.name}'::name, '${cmd}');\n`;
        this.testCount++;
    }

    createSupabaseUser(userIdentifier: string) {
        this.sql += `SELECT tests.create_supabase_user('${userIdentifier}');\n`;
    }

    authenticateAs(userIdentifier: string) {
        this.sql += `SELECT tests.authenticate_as('${userIdentifier}');\n`;
    }

    clearAuthentication() {
        this.sql += `SELECT tests.clear_authentication();\n`;
    }

    throwsOk(sql: string, error: string, description: string) {
        this.sql += `SELECT throws_ok(
    $_sql_$${sql}$_sql_$,
    $_error_$${error}$_error_$,
    $_description_$${description}$_description_$
);\n`;
        this.testCount++;
    }

    livesOk(sql: string, description: string) {
        this.sql += `SELECT lives_ok(
    $_sql_$${sql}$_sql_$,
    $_description_$${description}$_description_$
);\n`;
        this.testCount++;
    }

    isEmpty(sql: string, description: string) {
        this.sql += `SELECT is_empty(
    $_sql_$${sql}$_sql_$,
    $_description_$${description}$_description_$
);\n`;
        this.testCount++;
    }

    isntEmpty(sql: string, description: string) {
        this.sql += `SELECT isnt_empty(
    $_sql_$${sql}$_sql_$,
    $_description_$${description}$_description_$
);\n`;
        this.testCount++;
    }

    setEq(sql: string, set: string[], description: string) {
        this.sql += `SELECT set_eq(
    $_sql_$${sql}$_sql_$,
    array [${map(set, item => `'${item}'`).join(', ')}],
    $_description_$${description}$_description_$
);\n`;
        this.testCount++;
    }

    async writeSQL() {
        const sqlFile = argv[2];
        await mkdir(dirname(sqlFile), {recursive: true});
        await writeFile(sqlFile, `BEGIN;

CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions CASCADE;
CREATE EXTENSION IF NOT EXISTS "basejump-supabase_test_helpers";
CREATE EXTENSION IF NOT EXISTS supatest WITH SCHEMA public CASCADE;

SELECT plan(${this.testCount});

${this.sql}
SELECT * FROM finish();

ROLLBACK;
`);
    }
}
