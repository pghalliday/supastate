import {Supastate} from "../../../Supastate.js";
import type {Schema} from "../../../entities/models/Schema.js";
import {RootTable} from "../models/RootTable.js";
import {MembershipTable} from "../models/MembershipTable.js";

export interface MembershipTableParams {
    name: string;
    schema: Schema;
    primaryKeyColumnName: string;
    primaryKeyColumnType: string;
    memberColumnName: string;
    memberTable: RootTable;
    groupColumnName: string;
    groupTable: RootTable;
    external?: boolean;
}

export class MembershipTableFactory {
    constructor(private readonly supastate: Supastate) {}

    addMembershipTable(params: MembershipTableParams): MembershipTable {
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
        const memberColumn = this.supastate.addColumn({
            name: params.memberColumnName,
            type: params.memberTable.primaryKeyColumn.type,
            table: table,
            external: params.external,
        });
        const memberForeignKeyConstraint = this.supastate.addForeignKeyConstraint({
            name: `${table.name}_${memberColumn.name}_fkey`,
            table: table,
            columns: [memberColumn],
            otherTable: params.memberTable.table,
            otherColumns: [params.memberTable.primaryKeyColumn],
            external: params.external,
        });
        const groupColumn = this.supastate.addColumn({
            name: params.groupColumnName,
            type: params.groupTable.primaryKeyColumn.type,
            table: table,
            external: params.external,
        });
        const groupForeignKeyConstraint = this.supastate.addForeignKeyConstraint({
            name: `${table.name}_${groupColumn.name}_fkey`,
            table: table,
            columns: [groupColumn],
            otherTable: params.groupTable.table,
            otherColumns: [params.groupTable.primaryKeyColumn],
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
            memberColumn,
            memberForeignKeyConstraint,
            groupColumn,
            groupForeignKeyConstraint,
            rlsSetting,
        };
    }
}
