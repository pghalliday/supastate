import {v4} from "uuid";
import {Table} from "./Table.js";
import {Expression} from "../../util/models/Expression.js";
import {PolicyTo} from "../../util/models/PolicyTo.js";

export const POLICY_TYPE = 'policy';

export type PolicyAs =
    "PERMISSIVE" |
    "RESTRICTIVE";

export type PolicyFor =
    "ALL" |
    "SELECT" |
    "INSERT" |
    "UPDATE" |
    "DELETE";

export interface Policy {
    entityType: typeof POLICY_TYPE;
    id: string;
    name: string;
    tableId: string;
    as?: PolicyAs;
    for?: PolicyFor;
    to: PolicyTo[];
    using?: Expression;
    withCheck?: Expression;
    external: boolean;
}

export interface PolicyParams {
    name: string;
    table: Table;
    as?: PolicyAs;
    for?: PolicyFor;
    to?: PolicyTo[];
    using?: Expression;
    withCheck?: Expression;
    external?: boolean;
}

export function initPolicy(params: PolicyParams): Policy {
    return {
        entityType: POLICY_TYPE,
        id: v4(),
        name: params.name,
        tableId: params.table.id,
        as: params.as,
        for: params.for,
        to: params.to || [],
        using: params.using,
        withCheck: params.withCheck,
        external: params.external || false,
    };
}
