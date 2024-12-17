import {v4} from "uuid";
import {Column} from "./Column.js";
import _ from "lodash";
import assert from "node:assert";
import {Table} from "./Table.js";
const {map, uniq, zip, forEach} = _;

export const FOREIGN_KEY_CONSTRAINT_TYPE = 'foreign_key_constraint';

export interface ForeignKeyConstraint {
    entityType: typeof FOREIGN_KEY_CONSTRAINT_TYPE;
    id: string;
    name: string;
    columnIds: string[];
    tableId: string;
    otherColumnIds: string[];
    otherTableId: string;
    external: boolean;
}

export interface ForeignKeyConstraintParams {
    table: Table;
    name: string;
    columns: Column[];
    otherTable: Table;
    otherColumns: Column[];
    external?: boolean;
}

export function initForeignKeyConstraint(params: ForeignKeyConstraintParams): ForeignKeyConstraint {
    forEach(zip(params.columns, params.otherColumns), ([column, otherColumn]) => {
        assert(typeof column !== 'undefined', 'Fewer columns than other columns');
        assert(typeof otherColumn !== 'undefined', 'Fewer other columns than columns');
        assert(column.type === otherColumn.type, 'Column types do not match');
    });
    const columnTableIds = uniq(map(params.columns, column => column.tableId));
    assert(columnTableIds.length === 1, 'Columns must all be for the same table');
    const tableId = params.table.id;
    assert(tableId === columnTableIds[0], 'Columns must be from the specified table')
    const otherColumnTableIds = uniq(map(params.otherColumns, column => column.tableId));
    assert(otherColumnTableIds.length === 1, 'Other columns must all be for the same table');
    const otherTableId = params.otherTable.id;
    assert(otherTableId === otherColumnTableIds[0], 'Other columns must be from the specified table')
    return {
        entityType: FOREIGN_KEY_CONSTRAINT_TYPE,
        id: v4(),
        name: params.name,
        columnIds: map(params.columns, column => column.id),
        tableId,
        otherColumnIds: map(params.otherColumns, column => column.id),
        otherTableId,
        external: params.external || false,
    };
}
