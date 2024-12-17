import {Supastate} from "../../Supastate.js";
import {Table} from "../../entities/models/Table.js";
import type {Schema} from "../../entities/models/Schema.js";
import {Column} from "../../entities/models/Column.js";
import {PrimaryKeyConstraint} from "../../entities/models/PrimaryKeyConstraint.js";
import {RLSEnabled} from "../../entities/models/RLSEnabled.js";

export interface RootTable {
    table: Table;
    primaryKeyColumn: Column;
    primaryKeyConstraint: PrimaryKeyConstraint;
    rlsSetting: RLSEnabled;
}

export interface RootTableParams {
    name: string;
    schema: Schema;
    primaryKeyColumnName: string;
    primaryKeyColumnType: string;
    external?: boolean;
}

export class RootTableFactory {
    constructor(private readonly supastate: Supastate) {}

    addRootTable(params: RootTableParams): RootTable {
        const table = this.supastate.addTable({
            name: params.name,
            schema: params.schema,
            external: params.external,
        });
        const primaryKeyColumn = this.supastate.addColumn({
            name: params.primaryKeyColumnName,
            type: params.primaryKeyColumnType,
            table: table,
            external: params.external,
        });
        const primaryKeyConstraint = this.supastate.addPrimaryKeyConstraint({
            table: table,
            columns: [primaryKeyColumn],
            external: params.external,
        });
        const rlsSetting = this.supastate.addRLSEnabled({
            table: table,
            external: params.external,
        });
        return {
            table,
            primaryKeyColumn,
            primaryKeyConstraint,
            rlsSetting,
        };
    }
}
