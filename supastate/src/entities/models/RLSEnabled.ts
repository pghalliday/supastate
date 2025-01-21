import {v4} from "uuid";
import {Table} from "./Table.js";

export const RLS_ENABLED_TYPE = 'rls_enabled';

export interface RLSEnabled {
    entityType: typeof RLS_ENABLED_TYPE;
    id: string;
    tableId: string;
    force: boolean;
    external: boolean;
}

export interface RLSEnabledParams {
    table: Table;
    force?: boolean;
    external?: boolean;
}

export function initRLSEnabled(params: RLSEnabledParams): RLSEnabled {
    return {
        entityType: RLS_ENABLED_TYPE,
        id: v4(),
        tableId: params.table.id,
        force: params.force || false,
        external: params.external || false,
    };
}
