import {Supastate} from "../../../Supastate.js";
import type {Schema} from "../../../entities/models/Schema.js";
import {InformationTable} from "../models/InformationTable.js";
import {OwnerTable} from "../models/OwnerTable.js";

export interface InformationTableParams {
    name: string;
    schema: Schema;
    foreignKeyColumnName: string;
    ownerTable: OwnerTable;
    external?: boolean;
}

export class InformationTableFactory {
    constructor(private readonly supastate: Supastate) {}

    addInformationTable(params: InformationTableParams): InformationTable {
        const table = this.supastate.addTable({
            name: params.name,
            schema: params.schema,
            external: params.external,
        });
        const primaryKeyColumn = this.supastate.addColumn({
            name: params.foreignKeyColumnName,
            type: params.ownerTable.primaryKeyColumn.type,
            table: table,
            external: params.external,
        });
        const primaryKeyConstraint = this.supastate.addPrimaryKeyConstraint({
            name: `${table.name}_${primaryKeyColumn.name}_pkey`,
            table: table,
            columns: [primaryKeyColumn],
            external: params.external,
        });
        const foreignKeyConstraint = this.supastate.addForeignKeyConstraint({
            name: `${table.name}_${primaryKeyColumn.name}_fkey`,
            table: table,
            columns: [primaryKeyColumn],
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
            primaryKeyConstraint,
            foreignKeyConstraint,
            rlsSetting,
        };
    }
}
