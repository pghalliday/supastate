import {v4} from "uuid";
import {Column} from "./Column.js";

export const NOT_NULL_CONSTRAINT_TYPE = 'not_null_constraint';

export interface NotNullConstraint {
    entityType: typeof NOT_NULL_CONSTRAINT_TYPE;
    id: string;
    columnId: string;
    external: boolean;
}

export interface NotNullConstraintParams {
    column: Column;
    external?: boolean;
}

export function initNotNullConstraint(params: NotNullConstraintParams): NotNullConstraint {
    return {
        entityType: NOT_NULL_CONSTRAINT_TYPE,
        id: v4(),
        columnId: params.column.id,
        external: params.external || false,
    };
}
