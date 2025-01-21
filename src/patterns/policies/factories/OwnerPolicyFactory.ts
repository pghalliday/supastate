import {Supastate} from "../../../Supastate.js";
import {UserPolicy} from "../models/UserPolicy.js";
import {Table} from "../../../entities/models/Table.js";
import {PolicyAs, PolicyFor} from "../../../entities/models/Policy.js";
import {PolicyTo} from "../../../entities/models/PolicyTo.js";
import {createExpression} from "../../../entities/models/Expression.js";

export interface OwnerPolicyParams {
    name: string;
    table: Table;
    as?: PolicyAs;
    for?: PolicyFor;
    to?: PolicyTo[];
    external?: boolean;
}

export class OwnerPolicyFactory {
    constructor(private readonly supastate: Supastate) {}

    addOwnerPolicy(params: OwnerPolicyParams): UserPolicy {
        const expression = createExpression('true', {});
        const withCheck = (params.for === 'INSERT') ? expression : undefined;
        const using = (params.for !== 'INSERT') ? expression : undefined;
        const policy = this.supastate.addPolicy({
            name: params.name,
            table: params.table,
            as: params.as,
            for: params.for,
            to: params.to,
            using,
            withCheck,
            external: params.external,
        });
        return {
            policy,
        };
    }
}
