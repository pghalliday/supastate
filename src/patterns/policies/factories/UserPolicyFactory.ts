import {Supastate} from "../../../Supastate.js";
import {UserPolicy} from "../models/UserPolicy.js";
import {Table} from "../../../entities/models/Table.js";
import {PolicyAs, PolicyFor} from "../../../entities/models/Policy.js";
import {PolicyTo} from "../../../entities/models/PolicyTo.js";

export interface UserPolicyParams {
    name: string;
    table: Table;
    as?: PolicyAs;
    for?: PolicyFor;
    to?: PolicyTo[];
    external?: boolean;
}

export class UserPolicyFactory {
    constructor(private readonly supastate: Supastate) {}

    addUserPolicy(params: UserPolicyParams): UserPolicy {
        // TODO: implement the using/with check clauses
        const policy = this.supastate.addPolicy({
            name: params.name,
            table: params.table,
            as: params.as,
            for: params.for,
            to: params.to,
            external: params.external,
        });
        return {
            policy,
        };
    }
}
