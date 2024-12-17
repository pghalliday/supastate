import {v4} from "uuid";
import {Column} from "./Column.js";
import _ from "lodash";
import assert from "node:assert";
import {Table} from "./Table.js";
const {map, uniq} = _;

export const PRIMARY_KEY_CONSTRAINT_TYPE = 'primary_key_constraint';

export interface PrimaryKeyConstraint {
    entityType: typeof PRIMARY_KEY_CONSTRAINT_TYPE;
    id: string;
    name: string;
    columnIds: string[];
    tableId: string;
    external: boolean;
}

export interface PrimaryKeyConstraintParams {
    name: string;
    table: Table;
    columns: Column[];
    external?: boolean;
}

export function initPrimaryKeyConstraint(params: PrimaryKeyConstraintParams): PrimaryKeyConstraint {
    const columnTableIds = uniq(map(params.columns, column => column.tableId));
    assert(columnTableIds.length === 1, 'Columns must all be for the same table');
    const tableId = params.table.id;
    assert(tableId === columnTableIds[0], 'Columns must be from the specified table')
    return {
        entityType: PRIMARY_KEY_CONSTRAINT_TYPE,
        id: v4(),
        name: params.name,
        columnIds: map(params.columns, column => column.id),
        tableId,
        external: params.external || false,
    };
}
