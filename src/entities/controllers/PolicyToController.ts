import {Entities} from "../models/Entities.js";
import {POLICY_TO_ROLE_TYPE, PolicyTo} from "../models/PolicyTo.js";
import {PolicyToRoleController} from "./PolicyToRoleController.js";
import {PolicyToBuiltInController} from "./PolicyToBuiltInController.js";

export interface PolicyToController {
    getText(): string;
    getDependencies(): string[];
    match(toMatch: PolicyToController): boolean;
}

export function createPolicyToController(policyTo: PolicyTo, entities: Entities): PolicyToController {
    switch (policyTo.type) {
        case POLICY_TO_ROLE_TYPE:
            return new PolicyToRoleController(policyTo, entities);
        default:
            return new PolicyToBuiltInController(policyTo);
    }
}
