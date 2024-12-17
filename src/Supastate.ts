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

export class Supastate {
    constructor(private entities: Entities) {}

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
}
