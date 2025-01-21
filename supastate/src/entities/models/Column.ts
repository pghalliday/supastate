import {v4} from "uuid";
import {Table} from "./Table.js";

export const COLUMN_TYPE = 'column';

export interface Column {
    entityType: typeof COLUMN_TYPE;
    id: string;
    name: string;
    type: string;
    tableId: string;
    external: boolean;
}

export interface ColumnParams {
    name: string;
    type: string;
    table: Table;
    external?: boolean;
}

export function initColumn(params: ColumnParams): Column {
    return {
        entityType: COLUMN_TYPE,
        id: v4(),
        name: params.name,
        type: params.type,
        tableId: params.table.id,
        external: params.external || false,
    };
}
