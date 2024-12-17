import type {Schema} from "./Schema.js";
import {v4} from "uuid";

export const TABLE_TYPE = 'table';

export interface Table {
    entityType: typeof TABLE_TYPE;
    id: string;
    name: string;
    schemaId: string;
    external: boolean;
}

export interface TableParams {
    name: string;
    schema: Schema;
    external?: boolean;
}

export function initTable(params: TableParams): Table {
    return {
        entityType: TABLE_TYPE,
        id: v4(),
        name: params.name,
        schemaId: params.schema.id,
        external: params.external || false,
    };
}
