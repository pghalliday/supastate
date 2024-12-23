import {Supastate} from "../../../Supastate.js";
import type {Schema} from "../../../entities/models/Schema.js";
import {OwnerTable} from "../models/OwnerTable.js";
import {CollectionTable} from "../models/CollectionTable.js";

export interface CollectionTableParams {
    name: string;
    schema: Schema;
    primaryKeyColumnName: string;
    primaryKeyColumnType: string;
    foreignKeyColumnName: string;
    ownerTable: OwnerTable;
    external?: boolean;
}

export class CollectionTableFactory {
    constructor(private readonly supastate: Supastate) {}

    addCollectionTable(params: CollectionTableParams): CollectionTable {
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
            name: `${table.name}_${primaryKeyColumn.name}_pkey`,
            table: table,
            columns: [primaryKeyColumn],
            external: params.external,
        });
        const foreignKeyColumn = this.supastate.addColumn({
            name: params.foreignKeyColumnName,
            type: params.ownerTable.primaryKeyColumn.type,
            table: table,
            external: params.external,
        });
        const foreignKeyConstraint = this.supastate.addForeignKeyConstraint({
            name: `${table.name}_${foreignKeyColumn.name}_fkey`,
            table: table,
            columns: [foreignKeyColumn],
            otherTable: params.ownerTable.table,
            otherColumns: [params.ownerTable.primaryKeyColumn],
            external: params.external,
        });
        const rlsSetting = this.supastate.addRLSEnabled({
            table: table,
            external: params.external,
        });
        return {
            table,
            primaryKeyColumn,
            foreignKeyColumn,
            primaryKeyConstraint,
            foreignKeyConstraint,
            rlsSetting,
        };
    }
}
