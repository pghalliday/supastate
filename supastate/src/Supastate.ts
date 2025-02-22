import type {Entities} from "./entities/models/Entities.js";
import {initSchema, type Schema, type SchemaParams} from "./entities/models/Schema.js";
import {initTable, type Table, type TableParams} from "./entities/models/Table.js";
import {initRLSEnabled, RLSEnabled, RLSEnabledParams} from "./entities/models/RLSEnabled.js";
import {Column, ColumnParams, initColumn} from "./entities/models/Column.js";
import {
    initPrimaryKeyConstraint,
    PrimaryKeyConstraint,
    PrimaryKeyConstraintParams
} from "./entities/models/PrimaryKeyConstraint.js";
import {
    ForeignKeyConstraint,
    ForeignKeyConstraintParams,
    initForeignKeyConstraint
} from "./entities/models/ForeignKeyConstraint.js";
import {
    initNotNullConstraint,
    NotNullConstraint,
    NotNullConstraintParams
} from "./entities/models/NotNullConstraint.js";
import {initRole, Role, RoleParams} from "./entities/models/Role.js";
import {initPolicy, Policy, PolicyParams} from "./entities/models/Policy.js";
import {migrate} from "./entities/migration/migrate.js";
import {initEntityControllers} from "./entities/controllers/EntityControllers.js";

export class Supastate {
    entities: Entities;

    constructor() {
        this.entities = {};
    }

    addRole(params: RoleParams): Role {
        const role = initRole(params);
        this.entities[role.id] = role;
        return role;
    }

    addSchema(params: SchemaParams): Schema {
        const schema = initSchema(params);
        this.entities[schema.id] = schema;
        return schema;
    }

    addTable(params: TableParams): Table {
        const table = initTable(params);
        this.entities[table.id] = table;
        return table;
    }

    addRLSEnabled(params: RLSEnabledParams): RLSEnabled {
        const rlsEnabled = initRLSEnabled(params);
        this.entities[rlsEnabled.id] = rlsEnabled;
        return rlsEnabled;
    }

    addColumn(params: ColumnParams): Column {
        const column = initColumn(params);
        this.entities[column.id] = column;
        return column;
    }

    addPrimaryKeyConstraint(params: PrimaryKeyConstraintParams): PrimaryKeyConstraint {
        const primaryKeyConstraint = initPrimaryKeyConstraint(params);
        this.entities[primaryKeyConstraint.id] = primaryKeyConstraint;
        return primaryKeyConstraint;
    }

    addForeignKeyConstraint(params: ForeignKeyConstraintParams): ForeignKeyConstraint {
        const foreignKeyConstraint = initForeignKeyConstraint(params);
        this.entities[foreignKeyConstraint.id] = foreignKeyConstraint;
        return foreignKeyConstraint;
    }

    addNotNullConstraint(params: NotNullConstraintParams): NotNullConstraint {
        const notNullConstraint = initNotNullConstraint(params);
        this.entities[notNullConstraint.id] = notNullConstraint;
        return notNullConstraint;
    }

    addPolicy(params: PolicyParams): Policy {
        const policy = initPolicy(params);
        this.entities[policy.id] = policy;
        return policy;
    }

    migrate(currentEntities: Entities): string {
        return migrate(
            initEntityControllers(currentEntities),
            initEntityControllers(this.entities)
        )
    }
}
